import {Command, CommandArgTypes, CommandArgument} from "../../m/class";
import {Client, Message, MessageEmbed} from "discord.js";
import {inspect} from "util";
import vm from "vm"

const clean = (text:string) => {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}


module.exports = class Rex extends Command
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

    public run = async (message : Message, client : Client, args: {[x:string]:any} ) => {
        try {

            new Function(this.GetArg("code",args))
        } catch (e) {
            return {Worked :false, Error:e.toString()}
        }
        let context = {

        }
        vm.createContext(context)
        let script = new vm.Script(this.GetArg("code",args), {
            displayErrors:true,
        })
        try {
            let output = script.runInNewContext(context, {
                filename: "index.js",
                timeout:1e3,
                displayErrors:true
            })
            let Embed = new MessageEmbed()
                .setAuthor(message.author.username,message.author.avatarURL({dynamic:true,size:512}) ?? "")
                .addField("**Last expression**", `\`\`\`js\n${output}\`\`\``,true)
                .addField("**Context**", `\`\`\`js\n${inspect(context)}\`\`\``,true)
                .addField("**Entered Code**", `\`\`\`js\n${inspect(this.GetArg("code",args))}\`\`\``,true)
                .setColor("#9ae28b")
            message.channel.send(Embed);
        }
        catch (e) {
            return {Worked :false, Error:e.toString()}
        }

        return {Worked : true}
    }

}