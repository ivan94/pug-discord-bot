import Command from "../lib/Command";
import { Message } from "discord.js";
import { getDb } from "../lib/DbManager";
import crypto from "crypto";

class Register extends Command {
    constructor() {super("register")};

    usage(): string {
        return "!register bnet"
    }
    
    execute(args: string[], msg: Message): void {
        let db = getDb();
        if(!db) {
            msg.reply("We are having trouble with our DB, please try again later");
            return;
        }

        let users = db.collection('users');
        users.findOne({discord_id: msg.author.id}).then(doc => {
            let token = crypto.randomBytes(64).toString('hex');
            if(!doc) {
                users.insertOne({discord_id: msg.author.id, token: token, registered: false});
            } else {
                if(doc.registered) {
                    msg.reply("You are already registered");
                    return;
                } else {
                    users.updateOne({discord_id: doc.discord_id}, {$set: {token: token}});
                }
            }

            let url = `${process.env.SERVER_URL}/auth?discord_id=${msg.author.id}&token=${token}&platform=bnet`;
            msg.reply("Please enter click the link to register with your battle.net account: "+url);
        });
    }
}

export default Register;