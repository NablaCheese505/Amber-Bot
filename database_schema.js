const mongoose = require("mongoose");
const { DEFAULT_LANG } = require("./utils/i18n.js");

const guildSettingsSchema = new mongoose.Schema({
    _id: String,
    lang: { type: String, default: DEFAULT_LANG },
    logChannelId: { type: String, default: null },
    active: { type: Boolean, default: true }
});

const honeypotSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    roleId: { type: String, required: true },
    action: { type: String, enum: ['kick', 'ban', 'quarantine'], default: 'kick' },
    reason: { type: String, default: 'Activó un rol trampa (Honeypot).' }
});

const dependencySchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    parentRoleId: { type: String, required: true },
    dependentRoles: [{ type: String }]
});

module.exports = {
    GuildSettings: mongoose.model('GuildSettings', guildSettingsSchema),
    Honeypots: mongoose.model('Honeypot', honeypotSchema),
    Dependencies: mongoose.model('Dependency', dependencySchema)
};