import { Client, Message } from "discord.js"
import { status } from "../m/config";
import { getrnd } from "../m/func";

module.exports = function run(client :Client) : void {

    console.log('bot is now ready.')
    
    setInterval( ()  => {let data = status[getrnd(0,status.length-1)]; client.user!.setActivity( {name : data.title, type : data.type} ) }, 15e3) //@todo don't use random, as it might return the same one a few times in a row. instead make it cycle.

}
