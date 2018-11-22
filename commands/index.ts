import CommandManager from "../lib/CommandManager";

import Rank from "./Rank";
import Help from "./Help";
import Register from "./Register";

export function bootstrap(manager: CommandManager): void {
    manager.registerCommand(new Rank);
    manager.registerCommand(new Help);
    manager.registerCommand(new Register);
}