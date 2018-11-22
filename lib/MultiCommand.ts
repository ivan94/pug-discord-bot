import Command from "./Command";
import { Message } from "discord.js";
import CommandManager from "./CommandManager";

export default abstract class MultiCommand extends Command {
    manager: CommandManager;

    constructor(keyword: string) {
        super(keyword);
        this.manager = new CommandManager(2);
        this.registerCommands();
    }

    execute(args: string[], msg: Message): void {
        this.manager.runCommand(args[0], msg);
    }

    abstract registerCommands(): void;
}