const { Client, ModalSubmitInteraction, MessageFlags, EmbedBuilder } = require("discord.js");
const axios = require("axios");

const data = require('../JSON/data.json');
const settings = require(process.env.DISK_PATH 
    ? path.join(process.env.DISK_PATH, "settings.json") 
    : "../settings.json");

const { getAllServers } = require('../Functions/StoreManager');

module.exports = {
    customId: "editor-note-edit",
    /**
     * 
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    async execute(client, interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const changed = interaction.fields.getTextInputValue("changed");

        const ms = new Date(data.updateTime).getTime();
        const floor = Math.floor(ms/1000);
        const universeId = data.rootPlace.split('/');

        let thumbnail = await axios.get(`https://thumbnails.roblox.com/v1/assets?assetIds=${settings.universeId}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`);
        let icon = await axios.get(`https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${settings.universeId}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`);

        const servers = await getAllServers();

        const embed = new EmbedBuilder()
        .setColor('Grey')
        .setTitle("Aircraft Development")
        .setDescription(`Aircraft Development just got updated <t:${floor}:F>.\n\nTo check out the update, click the link below\n[Game Link](https://www.roblox.com/games/${universeId[3]}/)\n`)
        .addFields(
            { name: "Editor Notes", value: `${changed}` }
        )

        .setFooter({ text: `Aircraft Development Notifier - Edited By: ${interaction.user.username}` })


        if (icon.status == 200) {
            icon = icon.data;
            embed.setThumbnail(icon.data[0].imageUrl)
        }   

        if (thumbnail.status == 200) {
            thumbnail = thumbnail.data;

            embed.setImage(thumbnail.data[0].imageUrl)
        } 

        for (i=0; i < servers.length; i++) {
            const element = servers[i];
            if (element.lastMsgId) {
                const msg = await client.channels.cache.get(element.announceChannelId).messages.fetch(element.lastMsgId);

                if (msg) {
                    msg.edit({ embeds: [embed] });
                }
            }
        }

        await interaction.followUp({ content: "Content updated! 🎊" });
    }
}