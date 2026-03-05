const { ModalBuilder, Client, ButtonInteraction, TextInputBuilder, LabelBuilder, TextInputStyle, MessageFlags } = require("discord.js");

const settings = require('../settings.json');

module.exports = {
    customId: "editor-notes",
    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    async execute(client, interaction) {
        if (!settings.usersToDM.includes(interaction.user.id)) {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            await interaction.followUp({ content: "Why are you gay?" });
            return;
        }

        const textinput = new TextInputBuilder()
        .setCustomId('changed')
        .setId(2)
        .setPlaceholder("What has changed?")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)

        const label = new LabelBuilder()
        .setId(1)
        .setLabel("What has changed?")
        .setDescription("Enter Editor Notes below. (e.g. New Aircraft?)")
        .setTextInputComponent(textinput)

        const modal = new ModalBuilder()
        .setCustomId("editor-note-edit")
        .setTitle("Change the Editor Notes")
        .addLabelComponents(label)

        await interaction.showModal(modal);
    }
}