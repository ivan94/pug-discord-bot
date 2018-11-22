import Command from "./Command";
import { Message } from "discord.js";

class CommandManager {
    commands: { [keyword: string]: Command } = {};
    depth: number;

    constructor(depth: number = 1) {
        this.depth = depth;
    }

    registerCommand(command: Command): void {
        this.commands[command.keyword] = command;
    }

    getCommandMarkers(): string[] {
        return ['!', '#']
    }

    parseAndRun(msg: Message): void {
        var content = msg.content;
        if (this.getCommandMarkers().includes(content[0])) {
            var keyword = content.substring(1).split(/\s+/)[0];
            this.runCommand(keyword, msg);
        }
    }

    runCommand(keyword: string, msg: Message): void {
        var command = this.commands[keyword];
        if (command) {
            command.execute(this.buildArgs(msg.content, command.joingArgs), msg);
        } else {
            msg.reply("No command found");
        }
    }

    buildArgs(message: string, joinArgs: boolean = false): string[] {
        var words = message.split(/\s+/);
        if (!joinArgs) {
            return words.slice(this.depth);
        } else {
            let argList = words.slice(this.depth);
            if (argList.length > 0) {
                return [argList.join(' ')];
            } else {
                return [];
            }
        }
    }
}

export default CommandManager;