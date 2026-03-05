const { Client, EmbedBuilder, SlashCommandBuilder, InteractionContextType, CommandInteraction } = require("discord.js");
const axios = require('axios');
const data = require("../../JSON/data.json");
const settings = require('../../settings.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Shows the recent update of Aircraft Development.")
    .setContexts(InteractionContextType.Guild),
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @returns 
     */
    async execute(client, interaction) {
        await interaction.deferReply();

        const ms = new Date(data.updateTime).getTime();
        const floor = Math.floor(ms/1000);
        const universeId = data.rootPlace.split('/');
        let thumbnail = await axios.get(`https://thumbnails.roblox.com/v1/assets?assetIds=${settings.universeId}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`);
        let icon = await axios.get(`https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${settings.universeId}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`);
        // console.log(icon.data)

        try {
            const embed = new EmbedBuilder()
                .setColor('Grey')
                .setTitle("Aircraft Development")
                .setDescription(`Aircraft Development just got updated <t:${floor}:t>\n\nTo check out the update, click the link below\n[Game Link](https://www.roblox.com/games/${universeId[3]}/)`)
            
                .setFooter({ text: "Aircraft Development Notifier - Test" })

            if (icon.status == 200) {
                icon = icon.data;
                embed.setThumbnail(icon.data[0].imageUrl)
            }   

            if (thumbnail.status == 200) {
                thumbnail = thumbnail.data;

                embed.setImage(thumbnail.data[0].imageUrl)
            } 

            return interaction.followUp({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            const embed = new EmbedBuilder()
            .setTitle("Unable to fetch Game Info")
            .setColor("Red")
            .addFields({name: "Error", value:"Website unable to reach or is currently down"})

            return interaction.followUp({ embeds: [embed] });
        }
    }
}