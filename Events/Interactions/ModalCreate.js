module.exports = {
  name: "interactionCreate",
  async execute(client, interaction) {
    if (!interaction.isModalSubmit()) return;

    const modal = client.modals.get(interaction.customId);
    console.log(modal)
    if (!modal) return;

    try {
       await modal.execute(client, interaction)
    } catch (err) {
        console.log(err);
    }
  }
}