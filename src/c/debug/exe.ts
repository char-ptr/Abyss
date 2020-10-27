import {Command, CommandArgTypes, CommandArgument} from "../../m/class";
import {Client, Message, MessageEmbed} from "discord.js";
import vm from "vm";
import {inspect} from "util";

function FitStr(s:string,max:number){
    if (s.length-1 > max){
        return s.slice(0,max-3) + "..."
    }
    return s;
}


module.exports = class Exe extends Command
{

    constructor(  ) 
    {

        super
        ( 
            { 
                Name : 'exe',
                Desc : 'Execute javascript. in current context',
                Guild : false,
                Owner : true,
                Hidden : true,
                Alias : ['exec'],
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
            message,client,args,require,process
        }
        vm.createContext(context)
        let script = new vm.Script(this.GetArg("code",args), {
            displayErrors:true,
        })
        try {
            let output = script.runInContext(context, {
                filename: "index.js",
                timeout:1e3,
                displayErrors:true
            })
            let Embed = new MessageEmbed()
                .setAuthor(message.author.username,message.author.avatarURL({dynamic:true,size:512}) ?? "")
                .addField("**Last Statement**", `\`\`\`js\n${FitStr(inspect(output),400)}\`\`\``,true)
                .addField("**Entered Code**", `\`\`\`js\n${FitStr(inspect(this.GetArg("code",args)),400)}\`\`\``,true)
                .setColor("#9ae28b")
            message.channel.send(Embed);
        }
        catch (e) {
            return {Worked :false, Error:e.toString()}
        }


        return {Worked : true}
    }

}