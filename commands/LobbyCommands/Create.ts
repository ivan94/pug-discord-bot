import Command from "../../lib/Command";
import { Message } from "discord.js";

export default class Create extends Command {
    constructor() {super('create')}

    execute(args: string[], msg: Message): void {
        
    }

    usage(): string {
        return "!lobby create";
    }
}