import {Command, CommandArgTypes, CommandArgument} from "../../m/class";
import {Client, Message} from "discord.js";

const clean = (text:string) => {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}


module.exports = class test extends Command 
{

    constructor(  ) 
    {

        super
        ( 
            { 
                Name : 'exe',
                Desc : 'Execute javascript.',
                Guild : false,
                Owner : true,
                Hidden : true,
                Alias : ['Exec'],
                Args : [new CommandArgument({
                    Name : 'code',
                    Needed : true,
                    Type : "str" as keyof CommandArgTypes,
                    Perms : null,
                })]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {
        try {
            const code = this.GetArg('code',args!)
            let evaled = await eval(code);
       
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
       
              message.channel.send(clean(evaled), {code:"ts", split:true});
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`ts\n${clean(err)}\n\`\`\``);
        }


        return {Worked : true}
    }

}