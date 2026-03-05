const { loadFiles } = require('./loadFiles');

async function loadEvents(client) {
    console.time("[Loader] Events loaded");

    client.events = new Map();
    const events = new Array();

    const files = await loadFiles("Events");

    for (const file of files) {
        try {
            const event = require(file);
            const execute = (...args) => event.execute(client, ...args);

            const target = event.rest ? client.rest : client;

            target[event.once ? "once" : "on"](event.name, execute);
            events.push({ Event: event.name, Status: "✅" });
        } catch (err) {
            console.log(err);
            events.push({ Event: file.split("/").pop().slice(0,-3), Status: "❌" });
        }
    }

    console.table(events, ["Event", "Status"]);
    console.info("[Loader] Loaded Events.")
    console.timeEnd("[Loader] Events loaded")
}

module.exports = { loadEvents };