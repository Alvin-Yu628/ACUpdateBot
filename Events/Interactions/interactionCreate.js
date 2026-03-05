const { EmbedBuilder, Client, CommandInteraction } = require('discord.js');

module.exports = {
  name: "interactionCreate",
  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */
  async execute(client, interaction) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);


    const NotACommand = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Invalid Command")
    .setDescription("This command does not exist")
    
    if (!command) return interaction.reply({ embeds: [NotACommand] });

    const ErrorEmbed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Prompt")
    .setDescription("You are missing permissions")
    .addFields(
        { name: "Required Permissions:", value: `${command.permission}`},
        { name: "Current Permissions", value: `${interaction.member.permissions.toArray().join(", ")}`}
    )
    
    if (command.permission && !interaction.member.permissions.has(command.permission)) return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });

    const developerOnlyEmbed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Prompt")
    .setDescription("This Command is Only for Developers")

    if (command.DeveloperOnly && interaction.user.id !== "570421886606114817") return interaction.reply({ embeds: [developerOnlyEmbed] });

    try {
        if (command) {
          await command.execute(client, interaction);
        } else {
          console.log("Command not found.")
        }
    } catch (error) {
        console.log(error)

        const ErrorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Oops.")
        .setDescription(`There was an error while executing this command\n``${error.message}```)

      if (interaction.deferred) {
        return interaction.followUp({ embeds: [ErrorEmbed] }).catch(err => console.log(err));
      }
  
      if (interaction.isRepliable()) {
        return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true }).catch(err => console.log(err));
      } else {
        return interaction.editReply({ embeds: [ErrorEmbed] }).catch(err => console.log(err));
      }
    }
    
  }
}