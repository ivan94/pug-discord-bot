import { registerCommand } from "../lib/CommandManager";

import Rank from "./Rank";
import Help from "./Help";
import Register from "./Register";

export function bootstrap(): void {
    registerCommand(new Rank);
    registerCommand(new Help);
    registerCommand(new Register);
}