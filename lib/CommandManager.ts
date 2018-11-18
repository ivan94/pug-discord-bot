import Command from "./Command";
import { Message } from "discord.js";

export let commands: {[keyword: string]: Command} = {};

export function registerCommand(command: Command): void {
    commands[command.keyword] = command;
}

export function getCommandMarkers(): string[] {
    return ['!', '#']
}

export function parseAndRun(msg: Message): void {
    var content = msg.content;
    if(getCommandMarkers().includes(content[0])) {
        var keyword = content.substring(1).split(/\s+/)[0];
        runCommand(keyword, msg);
    }
}

export function runCommand(keyword: string, msg: Message): void {
    var command = commands[keyword];
    if(command) {
        command.execute(buildArgs(msg.content, command.joingArgs), msg);
    } else {
        msg.reply("No command found");
    }
}

export function buildArgs(message: string, joinArgs: boolean = false): string[] {
    var words = message.split(/\s+/);
    if(!joinArgs) {
        return words.slice(1);
    } else {
        let argList = words.slice(1);
        if(argList.length > 0) {
            return [words.slice(1).join(' ')];
        } else {
            return [];
        }
    }
}