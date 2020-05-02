import { Client, Message } from "discord.js"

module.exports = function run(client :Client, id : number, ug? : Set<string>) : void {

    console.log(`Shard ${id} is now ready.${ug? ` unfortunately There a few guilds which are unavailable : ${[...ug.keys()].join(' | ')}` : ''}`)

}
