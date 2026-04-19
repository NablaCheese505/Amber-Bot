# 🍯 Amber Bot

<br>

## 📖 Description
A smart, lightweight, and open-source Discord security bot built for strict role management. 

**Amber** acts as a silent guardian for your server. Instead of relying on bloated features or heavy web servers, it focuses entirely on doing two things perfectly: catching malicious actors through automated honeypot traps and managing conditional role dependencies (like VIP or Server Booster perks) with absolute precision.

Built natively on Node.js and MongoDB, Amber is incredibly memory-efficient, 100% open-source, and designed to be effortlessly self-hosted via Docker.

## ✨ What makes Amber different?

Amber drops the unnecessary clutter found in massive multi-purpose bots and introduces highly specific, community-requested server management tools:

1. **🍯 Automated Honeypot Traps**
   * **Anti-Raid Security:** Create hidden, highly-privileged-looking "trap" roles. Bots, raiders, or compromised accounts that attempt to self-assign or interact with these roles via API exploits will be instantly kicked or banned by Amber.
   * **Customizable Punishments:** Choose the severity of the trap (Kick or Ban) directly through simple slash commands.

2. **🔗 Conditional Roles (Dependencies)**
   * **Smart Hierarchy:** Link roles together using a Parent-Child relationship. For example, link a "Custom Color" role (Child) to the "Server Booster" role (Parent).
   * **Auto-Revoke:** If a user ever loses their Parent role, Amber will automatically and instantly strip away all associated Child roles, preventing users from keeping perks they no longer qualify for.

3. **🌍 Internationalization (i18n)**
   * **Native Multi-language:** Full support for English and Spanish natively across all slash commands and bot responses.

4. **🐳 Docker Optimized (Extremely Lightweight)**
   * **Zero Bloat:** Unlike heavy leveling or economy bots, Amber requires no image processing libraries or web servers. The included Dockerfile uses an optimized Alpine Linux image, meaning the bot consumes barely any RAM and runs silently in the background.

***

## 🛠️ Hosting Your Own Instance (Docker / Recommended)

Amber is fully containerized. Deploying your own 24/7 security instance takes less than 5 minutes.

### Step 1: Prerequisites
1. **Discord Application:** Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new app.
   - Go to the **Bot** tab, generate a **Token**, and enable the **Server Members Intent** (required for role tracking).
2. **MongoDB Database:** You need a MongoDB instance. You can use a free cloud cluster from [MongoDB Atlas](https://cloud.mongodb.com/) or host it locally. 
3. **Docker & Git:** Ensure you have Docker (or Podman) and Docker Compose installed on your VPS or local machine.

### Step 2: Clone and Configure
Before booting up the bot, you must set up your environment variables and configuration file.

```bash
git clone https://github.com/NablaCheese505/Amber-Bot.git
cd Amber-Bot
```

**1. Environment Variables (`.env`)**
Create a `.env` file in the root directory and fill in your connection details:

```env
DISCORD_TOKEN=your_bot_token_here
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
```

**2. Bot Configuration (`config.json`)**
Open `config.json` and adjust the crucial settings:
- `developer_ids`: Add your personal Discord User ID to bypass security locks and use deployment commands.
- `test_server_ids`: Add the ID of your private testing server.
- `lockBotToDevOnly`: Set to `true` while testing, or `false` to allow server Admins to use the bot.

### Step 3: Lift Off! 🐳
Once your `.env` and `config.json` are ready, simply build and start the container:

```bash
docker compose up -d --build
```
This will install all dependencies and start the bot in the background. You can check the logs with `docker compose logs -f` to ensure it connected to Discord and MongoDB successfully.

**Final Step:** In your Discord server, run the `/deploy global:True` command to register all slash commands.

### 🔄 How to Update
Updating your instance is as simple as pulling the latest changes and rebuilding the container (bypassing the cache to ensure new code is loaded):

```bash
git pull origin main
docker compose build --no-cache
docker compose up -d
```

---

## 💻 Development & Modifying (The Manual Way)

If you want to modify the code or run it "bare metal" without Docker, you'll need to set up the environment manually. 

**Requirements:**
- **Node.js 20+**

**Setup:**
1. Clone the repo and configure your `.env` and `config.json` exactly as shown in Step 2 above.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the bot:
   ```bash
   node index.js
   ```

---

## 🛡️ Commands Overview

Amber uses modern Slash Commands. Most commands require **Administrator** permissions natively in Discord.

**Moderation & Security:**
- `/honeypot [create/list/delete]` - Manages the anti-raid trap roles and their respective punishments.
- `/dependency [link/unlink/list]` - Links a child role to a parent role (e.g., tying a VIP color to a Booster role).

**Developer / Core Commands:**
- `/deploy` - Deploys or updates the slash commands on the server (Restricted to `developer_ids`).
- `/botstatus` - Displays current bot latency, uptime, and database connection status.
- `/help` - Displays the command manual and bot information.

---

## 📜 Credits & License

**Amber Bot** was developed by Nabla (NablaCheese505).
Feel free to fork, modify, and host this bot for your own communities. Pull requests for bug fixes and code improvements are always welcome!