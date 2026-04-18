//classes/RoleManager.js
const { GuildSettings, Honeypots, Dependencies } = require("../database_schema.js");

class RoleManager {
    constructor(client) {
        this.client = client;
    }

    /**
     * Evalúa si un usuario recibió un rol prohibido (Honeypot)
     * @param {GuildMember} member - El miembro actualizado
     * @param {Array<String>} addedRoles - IDs de los roles que el usuario acaba de obtener
     */
    async evaluateHoneypots(member, addedRoles) {
        if (addedRoles.length === 0) return;

        // Busca en Mongo si alguno de los roles añadidos es un Honeypot configurado para este servidor
        const honeypot = await Honeypots.findOne({
            guildId: member.guild.id,
            roleId: { $in: addedRoles }
        });

        if (!honeypot) return; // No cayó en ninguna trampa

        try {
            console.log(`[RoleManager] Honeypot activado por ${member.user.tag} (Rol: ${honeypot.roleId})`);
            
            if (honeypot.action === 'ban') {
                await member.ban({ reason: honeypot.reason });
            } 
            else if (honeypot.action === 'kick') {
                await member.kick(honeypot.reason);
            }
            else if (honeypot.action === 'quarantine') {
                // Aquí podrías quitarle todos los roles y darle uno de "Aislado"
                // Implementación pendiente para la fase 2
                console.log(`[RoleManager] Acción 'quarantine' aún no implementada.`);
            }

            // Opcional: Aquí llamaríamos a la clase Logger (si existe) para avisar al staff
            // await this.client.logger.send(member.guild.id, `Usuario ${member.user.tag} sancionado por Honeypot.`);

        } catch (error) {
            console.error(`[RoleManager] Error al ejecutar Honeypot en ${member.user.tag}:`, error.message);
        }
    }

    /**
     * Evalúa si un usuario perdió un rol del que dependen otros roles
     * @param {GuildMember} oldMember - Estado anterior del miembro
     * @param {GuildMember} newMember - Estado actual del miembro
     * @param {Array<String>} removedRoles - IDs de los roles que el usuario acaba de perder
     */
    async evaluateDependencies(oldMember, newMember, removedRoles) {
        if (removedRoles.length === 0) return;

        // Buscar si alguno de los roles que perdió era un "Rol Padre" en este servidor
        const dependencies = await Dependencies.find({
            guildId: newMember.guild.id,
            parentRoleId: { $in: removedRoles }
        });

        if (dependencies.length === 0) return;

        // Extraer todos los roles hijos que debemos quitarle
        let rolesToRemove = [];
        dependencies.forEach(dep => {
            rolesToRemove.push(...dep.dependentRoles);
        });

        // Filtrar para intentar quitar solo los roles que el usuario realmente tiene actualmente
        const finalRolesToRemove = rolesToRemove.filter(roleId => newMember.roles.cache.has(roleId));

        if (finalRolesToRemove.length > 0) {
            try {
                console.log(`[RoleManager] Retirando roles condicionales a ${newMember.user.tag} por pérdida de rol padre.`);
                await newMember.roles.remove(finalRolesToRemove, "Pérdida de rol condicional (Dependencia caducada)");
                
            } catch (error) {
                console.error(`[RoleManager] Error al retirar dependencias a ${newMember.user.tag}:`, error.message);
            }
        }
    }

    /**
     * Punto de entrada principal disparado por el evento del cliente
     * @param {GuildMember} oldMember 
     * @param {GuildMember} newMember 
     */
    async handleUpdate(oldMember, newMember) {
        // Verificar si el servidor está activo en la BD
        const settings = await GuildSettings.findOne({ _id: newMember.guild.id });
        if (settings && !settings.active) return; // Si el bot está "apagado" en el server, ignorar

        // Extraer los IDs de los roles actuales y anteriores usando Map para eficiencia
        const oldRoleIds = Array.from(oldMember.roles.cache.keys());
        const newRoleIds = Array.from(newMember.roles.cache.keys());

        // Identificar qué roles se añadieron y cuáles se quitaron
        const addedRoles = newRoleIds.filter(id => !oldRoleIds.includes(id));
        const removedRoles = oldRoleIds.filter(id => !newRoleIds.includes(id));

        // Ejecutar las validaciones en paralelo para no bloquear el hilo
        await Promise.all([
            this.evaluateHoneypots(newMember, addedRoles),
            this.evaluateDependencies(oldMember, newMember, removedRoles)
        ]);
    }
}

module.exports = RoleManager;