import MultiCommand from "../lib/MultiCommand";
import Create from "./LobbyCommands/Create";

export default class Lobby extends MultiCommand {
    constructor() { super('lobby') }

    registerCommands(): void {
        this.manager.registerCommand(new Create);
    }

    usage(): string {
        return "!lobby <sub_command> <args>";
    }
}