const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path')
const { loadEvents } = require('./Functions/loadEvents');

const express = require('express')

const app = express();
const port = process.env.PORT || 4000

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
});

require("dotenv").config({
    quiet: true,
});

const settings = require('./settings.json')


const universeId = settings.placeId;
const interval = settings.intervalTime;

const dataFilePath = process.env.DISK_PATH 
    ? path.join(process.env.DISK_PATH, "data.json") 
    : "./JSON/data.json";

// async function getWebsite() {
//     try {
//         //fetch update
//         const result = await axios.get(`https://apis.roblox.com/cloud/v2/universes/${universeId}`, {
//             headers: `x-api-key: ${process.env.roblox_api}`
//         });

//         if (result.status == 200) {
//             const data = result.data;

//             const dataToJSON = JSON.stringify(data, null, 2);
//             fs.writeFileSync(dataFilePath, dataToJSON, (err) => {
//                 if (err) {
//                     console.error(err);
//                     throw err;
//                 }
//             });

//             console.log("updated data.json");
//         } else {
//             console.log("Failed", result);
//         }

//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// }

async function getWebsite() {
    try {
        //fetch update
        const result = await axios.get(`https://games.roblox.com/v1/games?universeIds=170935858`, {
            headers: `x-api-key: ${process.env.roblox_api}`
        });

        if (result.status == 200) {
            const data = result.data.data[0];

            const dataToJSON = JSON.stringify(data, null, 2);
            fs.writeFileSync(dataFilePath, dataToJSON, (err) => {
                if (err) {
                    console.error(err);
                    throw err;
                }
            });

            console.log("updated data.json");
        } else {
            console.log("Failed", result);
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}



client.commands = new Collection();
client.modals = new Collection();
client.buttons = new Collection();

loadEvents(client);

getWebsite();
setInterval(function () {
    getWebsite();
}, interval * 1000);

app.get("/", (req, res) => [
    res.send("What are you doing here")
]);

app.listen(port, () => {
    console.log(`listening in port ${port}`)
});

client.login(process.env.token);

//universe id 170935858
//place id 447213146