import { Command, CommandArgument, CommandArgTypes} from "../../m/class";
import { Client, Message, GuildMember, MessageEmbed } from "discord.js";
import { Commands } from "../..";
import { GetCommandFromS } from "../../m/func";
import { Prefix } from "../../m/config";




module.exports = class test extends Command 
{

    constructor(  ) 
    {

        super
        ( 
            { 
                Name : 'help',
                Desc : 'Gets information on a command, or lists commands.',
                Guild : false,
                Owner : false,
                Hidden : false,
                Args : [new CommandArgument({
                    Name : 'Command',
                    Needed : false,
                    Type : "str",
                    Perms : null,
                    Position : [0]
                })]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {
        let cmd : string | undefined = this.GetArg('Command',args!)

        console.log(cmd)

        if(cmd) {

            let c = GetCommandFromS(cmd)

            if(!c) return {Worked:false, Error : new Error('Unable to find that command')}

            let emb = new MessageEmbed()
            emb.setAuthor(message.author.username,message.author.displayAvatarURL({dynamic:true}))
            emb.setDescription(`Information about the command "${c.Name}"`)
            emb.setTitle(c.Name)
            emb.setTimestamp(new Date())
            emb.setColor('#b0ffa8')
            emb.addField('Usage',`\`\`\`css\n${Prefix}${c.Name} ${c.Args ? c.Args.map(v => v.Needed ? `<${v.Name}${v.Position.length > 1 ? `-${v.Position.length-1} : ${v.Type}` : ''}>` : `[${v.Name}${v.Position.length > 1 ? `-${v.Position.length-1}` : ''} : ${v.Type}]`) : ''}\`\`\`\n\`<> = needed, [] = not needed, -number = length of arg(words)\``)
            emb.addField('Permissions', c.Perms?.toArray().join(', ') ?? 'No permissions')
            emb.addField('Guild only', c.Guild ? 'Yes' : 'No')
            
            message.channel.send(emb)

        } else {

            let emb = new MessageEmbed()
            emb.setAuthor(message.author.username,message.author.displayAvatarURL({dynamic:true}))
            emb.setDescription('All commands.')
            emb.setTitle('Commands')
            emb.setTimestamp(new Date())
            emb.setColor('#ffa978')
            emb.setThumbnail(client.user!.displayAvatarURL({dynamic:true}))
            for (let folder of Commands.entries()) {
                let arr = [...folder[1].keys()].filter(v => ! folder[1].get(v)?.Hidden).map(v => '• '+v)
                console.log(arr.length)
                emb.addField(folder[0],  arr.length <= 0 ? 'No commands!' : arr.join('\n') , emb.fields.length+1%3 != 0? true:false)

            }

            message.channel.send(emb)

        }

        return {Worked : true}
    }

}