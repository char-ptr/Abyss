import {Command, CommandArgTypes, CommandArgument} from "../../m/class";
import {Client, Message} from "discord.js";
import { inspect } from "util";

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
                Name : 'rex',
                Desc : 'Execute javascript.',
                Guild : false,
                Owner : false,
                Hidden : false,
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
        let code = `return (${this.GetArg('code',args!)})`
            code.replace(/(process)/gmi,'no')
        try {
            console.log(code)
            let func = function()
            {
                return new Function(code)()
            }

            let evaled = func.call({});
            console.log(evaled,func.toString())
       
            if (typeof evaled !== "string")
              evaled = inspect(evaled);
       
              message.channel.send(clean(evaled), {code:"js", split:true});
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`js\n${clean(err)}\n\`\`\``);
        }


        return {Worked : true}
    }

}