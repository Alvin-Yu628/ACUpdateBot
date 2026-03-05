const { loadFiles } = require('./loadFiles');

async function loadModal(client) {
    console.time("Modals Loaded");

    await client.modals.clear();
    let ListCommand = new Array;
  
    const Files = await loadFiles("Modals");
  
    Files.forEach(file => {   
      const command = require(file);
      const splitted = file.split("/");
      const directory = splitted[splitted.length - 2];
          
     const properties = { directory, ...command };
          
      if (command.customId) {
        client.modals.set(command.customId, properties);
      
        ListCommand.push({ Modals: command.customId, Status: "✅" });
      }
    });

    console.table(ListCommand, ["Modals", "Status"]);
    console.info("Loaded Modals.");
    console.timeEnd("Modals Loaded")
  }
  
  module.exports = { loadModal };