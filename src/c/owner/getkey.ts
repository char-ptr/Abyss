import {Command, CommandArgTypes, CommandArgument} from "../../m/class";
import {Client, Message, MessageEmbed} from "discord.js";
import {AsyncQuery,uuidv4} from "../../m/func"
const clean = (text:string) => {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}


module.exports = class GetKey extends Command
{

    constructor(  ) 
    {

        super
        ( 
            { 
                Name : 'getkey',
                Desc : 'get data about a key',
                Guild : false,
                Owner : true,
                Hidden : true,
                Alias : ['gtk'],
                Args : [new CommandArgument({
                    Name : 'key',
                    AltNames:['k'],
                    Needed : false,
                    Type : "str" as keyof CommandArgTypes,
                    Perms : null,
                })]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {
        let data = await AsyncQuery<{KEYID:string,Registered:number,CreatedAT:Date,RegisteredAT:null|Date,PowerID:number}>('select * from `whitelist`.`keycode` where KEYID = ?',this.GetArg('key',args!))
        if (!data[0]) return (message.channel.send('Unable to find that key'), {Worked:false})
        let reg = data[0]?.Registered == 1 ? 'true' : 'false'
        let embed = new MessageEmbed()
        .setTitle('Key Data')
        .setDescription(`Data on key \`${data[0]?.KEYID}\``)
        .setURL(`https://www.pozm.media/signup?key=${data[0]?.KEYID}`)
        .addField('power', data[0]?.PowerID,true)
        .addField('Registered', reg,true)
        .addField('\u200b', '\u200b',true)
        .addField('created at', data[0]?.CreatedAT.toLocaleDateString('en-gb'),true)
        .addField('Registered at', data[0]?.RegisteredAT ? data[0]?.RegisteredAT .toLocaleDateString('en-gb') : 'N/A',true)
        .addField('\u200b', '\u200b',true)

        message.channel.send(embed)
        return {Worked : true}
    }

}