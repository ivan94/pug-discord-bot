import { registerCommand } from "../lib/CommandManager";

import Rank from "./Rank";
import Help from "./Help";

export function bootstrap(): void {
    registerCommand(new Rank);
    registerCommand(new Help);
}