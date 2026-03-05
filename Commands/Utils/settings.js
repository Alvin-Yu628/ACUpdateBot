const { SlashCommandBuilder, InteractionContextType, Client, CommandInteraction, EmbedBuilder, ModalBuilder, LabelBuilder } = require("discord.js");
const { getSettings } = require("../../Functions/StoreManager");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Shows Server Setting.")
    .setContexts(InteractionContextType.Guild)
    .addSubcommand(cmd => 
        cmd.setName('set')
        .setDescription("Sets Server Settings.")
        .addChannelOption(
        option =>
        option.setName("channel")
        .setDescription("Select a channel that you would like to recieve update announcements.")
        .setRequired(false)
    ))
    .addSubcommand(cmd => 
        cmd.setName('view')
        .setDescription("Shows Server Settings.")
    ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        await interaction.deferReply();

        const subCommand = interaction.options.getSubcommand();
        const guildId = interaction.guildId;

        const serverSettings = await getSettings(guildId);

        const errorEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle("❌ | Error")
        
        const embed = new EmbedBuilder()
        .setColor(0x98FB98)
        .setTitle("Settings")

        console.log(subCommand)
        switch (subCommand) {
            case "set":
                if (interaction.options.data.length == 0) {
                    errorEmbed.setDescription("At least one or more options required.")
                    return interaction.followUp({ embeds: [errorEmbed] });
                }
                
                const channelOption = interaction.options.getChannel('channel') ?? interaction.channel;

                serverSettings.announceChannelId = channelOption.id;

                embed.addFields(
                    { name: "Set Announcement Channel as", value: `<#${channelOption.id}>`}
                )

                serverSettings.save();

                return interaction.followUp({ embeds: [embed] });
            case "view":
                console.log(serverSettings);
                if (!serverSettings) {
                    errorEmbed.setDescription("No server settings has been set.")
                    return interaction.followUp({ embeds: [errorEmbed] });
                }

                embed.addFields({ name: "Announcement channel", value: `${serverSettings.channelId ?? "N/A"}` })

                return interaction.followUp({ embeds: [embed] });
            default: console.log("wrong");
        }

    }
}