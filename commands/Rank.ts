import fetch from "node-fetch";
import { parse } from "node-html-parser";

import Command from "../lib/Command";
import { Message } from "discord.js";
import { getDb } from "../lib/DbManager";

class Rank extends Command {
    constructor() {super("rank")}

    execute(args: string[], message: Message): void {
        let db = getDb();
        let users = db.collection('users');
        
        users.findOne({discord_id: message.author.id}).then(doc => {
            if(!doc || !doc.registered) {
                message.reply("You are not registered yet, please run !register");
                return;
            }
            
            //TODO: support other platforms
            var profileUrl = this.buildUrl(doc.battletag);
            if(!profileUrl) {
                message.reply("Usage: "+this.usage());
                return;
            }
    
            fetch(profileUrl)
                .then(r => r.text())
                .then(text => {
                    var root = parse(text);
                    var rankElement = root.querySelector('.competitive-rank');
    
                    if(!rankElement) {
                        message.reply("Your profile is currently private, "+doc.battletag);
                        return;
                    }
    
                    var rank: string = rankElement.rawText;
                    message.reply(`Your rank is ${rank}, ${doc.battletag}`);
                })
                .catch(e => message.reply(e.message));
            
        });

    }

    buildUrl(source: string): string {
        var profileUrlRegex = /[(http|https)]:\/\/playoverwatch\.com\/..-..\/career/
        var battleTagRegex = /(.+?)#([0-9]+)/;
        var consoleRegex = /(.+?)#(psn|xbl)/;

        var profileMatch = source.match(profileUrlRegex)
        var battleTagMatch = source.match(battleTagRegex)
        var consoleMatch = source.match(consoleRegex);

        if(profileMatch) {
            return source;
        }

        if(battleTagMatch) {
            return `https://playoverwatch.com/en-us/career/pc/${battleTagMatch[1]}-${battleTagMatch[2]}`;
        }

        if (consoleMatch) {
            return `https://playoverwatch.com/en-us/career/${consoleMatch[2]}/${consoleMatch[1]}`;
        }

        return null;
    }

    usage() {
        return "!rank <profile_url>|<battle_tag>|<psn_id>#psn|<xbl_id>#xbl";
    }
}

export default Rank;