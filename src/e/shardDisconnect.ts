import { Client, Message, CloseEvent } from "discord.js"

module.exports = function run(client :Client, e : CloseEvent, id : number) : void {

    console.log(`shard ${id} is Disconnecting with code ${e.code} with reason ${e.reason} - ${e.wasClean}`)

}
