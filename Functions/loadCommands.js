const { loadFiles } = require("./loadFiles");

async function loadCommands(client) {
    console.time("[Loader] Commands Loaded");

    await client.commands.clear();

    let commandsArray = new Array;
    let ListCommand = new Array;
  
    const Files = await loadFiles("Commands");
  
    Files.forEach(file => {   
      const command = require(file);
      const splitted = file.split("\\");
      const directory = splitted[splitted.length - 2];
          
     const properties = { directory, ...command };
          
      if (command.data) {
        client.commands.set(command.data.name, properties);
      
        ListCommand.push({ Command: command.data.name, Status: "✅" });
        commandsArray.push(command.data.toJSON());
      }
    });
  
    client.application.commands.set(commandsArray);

    console.table(ListCommand, ["Command", "Status"]);
    console.timeEnd("[Loader] Commands Loaded")
}

module.exports = { loadCommands };