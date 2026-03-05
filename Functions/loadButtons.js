const { loadFiles } = require('./loadFiles');

async function loadButtons(client) {
    console.time("Buttons Loaded");

    await client.buttons.clear();
    let ListCommand = new Array;
  
    const Files = await loadFiles("Buttons");
  
    Files.forEach(file => {   
      const command = require(file);
      const splitted = file.split("/");
      const directory = splitted[splitted.length - 2];
          
     const properties = { directory, ...command };
          
      if (command.customId) {
        client.buttons.set(command.customId, properties);
      
        ListCommand.push({ Buttons: command.customId, Status: "✅" });
      }
    });

    console.table(ListCommand, ["Buttons", "Status"]);
    console.info("Loaded Buttons.");
    console.timeEnd("Buttons Loaded")
  }
  
  module.exports = { loadButtons };