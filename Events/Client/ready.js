const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const ms = require('ms');
const osUtils = require('os-utils');
const axios = require('axios');

const settings = require("../../settings.json");
const { getAllServers, getSettings } = require('../../Functions/StoreManager');
const dataJSON = require('../../JSON/data.json');

const { loadCommands } = require('../../Functions/loadCommands');
const { loadModal } = require('../../Functions/loadModals');
const { loadButtons } = require('../../Functions/loadButtons');

async function test(client) {
    const all = await getAllServers();
    console.log(all);
    for (i=0; i<all.length; i++) {
        const element = all[i];
        console.log(element);
        const serverSettings = await getSettings(element.id);

        if (element.announceChannelId) {
            const ms = new Date(dataJSON.updateTime).getTime();
            const floor = Math.floor(ms / 1000);
            const universeId = dataJSON.rootPlace.split('/');

            if (element.lastUpdated != floor) {
                serverSettings.lastUpdated = floor;
                serverSettings.save();

                let thumbnail = await axios.get(`https://thumbnails.roblox.com/v1/assets?assetIds=${settings.universeId}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`);
                let icon = await axios.get(`https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${settings.universeId}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`);

                try {
                    const button = new ButtonBuilder()
                    .setCustomId("editor-notes")
                    .setLabel("Edit this")
                    .setEmoji("📝")
                    .setStyle(ButtonStyle.Secondary)

                    const row = new ActionRowBuilder()
                    .addComponents(button)

                    const embed = new EmbedBuilder()
                        .setColor('Grey')
                        .setTitle("Aircraft Development")
                        .setDescription(`Aircraft Development just got updated <t:${floor}:F>.\n\nTo check out the update, click the link below\n[Game Link](https://www.roblox.com/games/${universeId[3]}/)`)

                        .setFooter({ text: "Aircraft Development Notifier" })

                    if (icon.status == 200) {
                        icon = icon.data;
                        embed.setThumbnail(icon.data[0].imageUrl)
                    }   

                    if (thumbnail.status == 200) {
                        thumbnail = thumbnail.data;
                        embed.setImage(thumbnail.data[0].imageUrl)
                    }

                    const channel = client.channels.cache.get(element.announceChannelId);

                    if (channel) {
                        const msg = await channel.send({ embeds: [embed], components: [row] });
                        serverSettings.lastMsgId = msg.id;
                        serverSettings.save();
                    }

                } catch (err) {
                    console.error(err);
                    throw err;
                }
            }
        }
    }
}

// function checkUpdate(client) {
//     const ms = new Date(dataJSON.updateTime).getDate();
//     const floor = Math.floor(ms / 1000);
//     const current = Date.now();

//     const shouldMakeAnnouncement = (floor >= current);

//     if (shouldMakeAnnouncement) {
//         test(client);
//     }
// }

module.exports = {
  name: "clientReady", 
  once: true,
  async execute(client) {
    // -------------- Events --------------//

    console.log("Bot is online.")

    loadCommands(client);
    loadModal(client);
    loadButtons(client);
  
    // Memory Data Update
    let memArray = [];
    let cpuArray = [];

    cpuArray.push()

    setInterval(async () => {
    
    //Used Memory in GB
    memArray.push((osUtils.totalmem() - osUtils.freemem()) / 1024);
    
    osUtils.cpuUsage(function(value) {
        cpuArray.push(value);
    });
    
    if (memArray.length >= 14) {
        memArray.shift();
    }

    if (cpuArray.length >= 14) {
        cpuArray.shift();
    }
    
    // Store in Database
    //   await DB.findOneAndUpdate({
    //       Client: true,
    //     }, {
    //       Memory: memArray,
    //       CPUusage: cpuArray
    //     },{
    //       upsert: true,
    //     });

        // client.user.setPresence({ activities: [{ name: `${client.guilds.cache.size} Servers`, type: "WATCHING" }], status: 'online' })
    }, ms("5s")); //= 5000 (ms)

    test(client);
  }
}