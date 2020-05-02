import { Client, Message } from "discord.js"

module.exports = function run(client :Client, err : Error, id : number) : void {

    console.log(`Got an error from shard ${id}\nThis is the err : ${err.name}\nMessage : ${err.message}\n${'--'.repeat(25)}stack${'--'.repeat(25)}\n${err.stack}\n${'--'.repeat(25)}stack${'--'.repeat(25)}`)

}
