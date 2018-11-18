import Discord from "discord.js";
import { parseAndRun } from "./lib/CommandManager";
import { bootstrap } from "./commands";

const client = new Discord.Client();

client.on("ready", () => {
    console.log("Bot logged in");
    bootstrap();
});

client.on("message", msg => {
    parseAndRun(msg);

});

client.login("NTEzNDA5MjQ2ODgxMzgyNDEx.DtHlyw.Qz48AizSyp1xAiwypzxdaOVbJLY");