import Command from "../lib/Command";
import { Message } from "discord.js";
import { commands } from "../lib/CommandManager";

class Help extends Command {
    constructor() {super("help")}

    usage(): string {
        return "!help <command_name>"
    }

    execute(args: string[], msg: Message): void {
        let command: Command = null;
        if(args.length != 1) {
            command = this;
        } else {
            command = commands[args[0]];
        }

        if(command) {
            msg.reply("Usage: " + command.usage());
        } else {
            msg.reply("Command not found");
        }

    }
}

export default Help;