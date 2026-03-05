const fs = require("fs");
const path = require("path");

// const filePath = path.resolve(__dirname, "../store.json");
const filePath = "../../store.json"

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
}

class GuildSettings {
    constructor(guildId, data) {
        this.guildId = guildId;
        Object.assign(this, data);
    }

    save() {
        const fullData = JSON.parse(fs.readFileSync(filePath, 'utf8') || '{}');

        const { guildId, ...settingToSave } = this;
        fullData[this.guildId] = settingToSave;
        fs.writeFileSync(filePath, JSON.stringify(fullData, null, 2))
    }
}

async function getSettings(guildId) {
   const fullData = JSON.parse(fs.readFileSync(filePath, 'utf8') || '{}');
   const guildData = fullData[guildId] || {};
   return new GuildSettings(guildId, guildData)
}

async function getAllServers() {
    const fullData = JSON.parse(fs.readFileSync(filePath, 'utf8') || '{}');
     return Object.keys(fullData).map(guildId => ({
        id: guildId,
        ...fullData[guildId]
    }));
}

module.exports = { getSettings, getAllServers };