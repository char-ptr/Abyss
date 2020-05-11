import { Command, CommandArgument, CommandArgTypes} from "../../m/class";
import { Client, Message, GuildMember, MessageEmbed, MessageAttachment } from "discord.js";
import got from "got";

module.exports = class test extends Command 
{

    constructor(  ) 
    {

        super
        ( 
            { 
                Name : 'getasset',
                Desc : 'Gets a shirt or pants asset from roblox.com.',
                Guild : false,
                Owner : false,
                Hidden : true,
                Args : [new CommandArgument({
                    Name : 'Asset',
                    Needed : true,
                    Type : "num" as keyof CommandArgTypes,
                    Perms : null,
                    Position : [0]
                })]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {
    
        let asset = this.GetArg('Asset',args!)

        let r = await got(`https://assetgame.roblox.com/Asset/?id=${asset}`,).catch( () => {return null} )
        if (!r) return {Worked : false, Error : new Error('Unable to find Anything with that id...')}
        let body = r.body
        let splitt = body.split('\n')
        let newUrl
        for (let v of splitt) {
            if (v.trim().startsWith('<url>')) newUrl = v.trim().slice(5,-6)
        }
        if(! newUrl) return {Worked : false, Error : new Error('Unable to find Anything with that id...')}
        let id = newUrl.slice(newUrl.indexOf('=')+1)
        message.channel.send( `https://www.roblox.com/library/${id}` )
        return {Worked : true}
    }

}