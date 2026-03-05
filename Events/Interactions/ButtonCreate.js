const { EmbedBuilder, Client, CommandInteraction } = require('discord.js');

module.exports = {
  name: "interactionCreate",
  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   * @returns 
   */
  async execute(client, interaction) {
    if (!interaction.isButton()) return;

    const button = client.buttons.get(interaction.customId);
    if (!button) return;

    try {
       await button.execute(client, interaction)
    } catch (err) {
        console.log(err);
    }
  }
}