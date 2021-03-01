import {Command, CommandArgTypes, CommandArgument} from "../../m/class";
import {Client, Message} from "discord.js";

module.exports = class GetAsset extends Command
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
                    Name : 'asset',
                    AltNames : ['id'],
                    Needed : true,
                    Type : "num" as keyof CommandArgTypes,
                    Perms : null,
                })]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {[x:string]:any} ) => {
    
        return {Worked : false, Error: 'broken'}


        // let asset = this.GetArg('asset',args!)
        // console.log(asset)

        // let r = await got(`https://assetgame.roblox.com/Asset/?id=${asset}`,).catch( () => {return null} )
        // if (!r) return {Worked : false, Error : new Error('Unable to find Anything with that id...')}
        // let body = r.body
        // let splitt = body.split('\n')
        // let newUrl
        // for (let v of splitt) {
        //     if (v.trim().startsWith('<url>')) newUrl = v.trim().slice(5,-6)
        // }
        // if(! newUrl) return {Worked : false, Error : new Error('Unable to find Anything with that id... 2')}
        // let id = newUrl.slice(newUrl.indexOf('=')+1)
        // message.channel.send( `https://www.roblox.com/library/${id}` )
        // return {Worked : true}
    }

}