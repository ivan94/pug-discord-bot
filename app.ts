import { config } from "dotenv";
import { Client }from "discord.js";
import CommandManager from "./lib/CommandManager";
import { bootstrap as bootCommands } from "./commands";
import { boot as bootDB } from "./lib/DbManager";

config();

const client = new Client();
export const manager = new CommandManager();

client.on("ready", () => {
    console.log("Bot logged in ", process.env.MONGO_URL);
    bootDB();
    bootCommands(manager);
});

client.on("message", msg => {
    manager.parseAndRun(msg);

});

client.login("NTEzNDA5MjQ2ODgxMzgyNDEx.DtHlyw.Qz48AizSyp1xAiwypzxdaOVbJLY");