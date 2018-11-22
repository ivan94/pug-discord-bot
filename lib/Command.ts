import { Message } from "discord.js";

export default abstract class Command {
    keyword: string;
    joingArgs: boolean;
    constructor(keyword: string, joingArgs: boolean = false) {
        this.keyword = keyword;
        this.joingArgs = joingArgs;
    }

    abstract execute(args: string[], msg: Message): void;
    abstract usage(): string;
}