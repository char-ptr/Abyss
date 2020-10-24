import {Command, CommandArgTypes, CommandArgument} from "../../m/class";
import {Client, Message} from "discord.js";
import {AsyncQuery,uuidv4} from "../../m/func"
const clean = (text:string) => {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}


module.exports = class GenKey extends Command
{

    constructor(  ) 
    {

        super
        ( 
            { 
                Name : 'genkey',
                Desc : 'Generate a key to be used at my website',
                Guild : false,
                Owner : true,
                Hidden : true,
                Alias : ['gek'],
                Args : [new CommandArgument({
                    Name : 'power',
                    AltNames:['p'],
                    Needed : false,
                    Type : "num" as keyof CommandArgTypes,
                    Perms : null,
                })]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {

        let uuid = uuidv4()

        await AsyncQuery('insert into `whitelist`.`keycode` (KEYID,PowerID) values (?,?)',[uuid,this.GetArg('power',args!) ?? 0])

        message.channel.send(`Created a key with the id of ${uuid}, redeem @ https://www.pozm.media/signup?key=${uuid}`)

        return {Worked : true}
    }

}