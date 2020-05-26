import { Command, CommandArgument, CommandArgTypes} from "../../m/class";
import { Client, Message, GuildMember, MessageEmbed } from "discord.js";
import { GetCommandFromS, IsIdOwner } from "../../m/func";
import { Prefix } from "../../m/config";
import { Commands } from "../../bot";
import {GetError} from "../../m/error";




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
                Alias : ['?'],
                Args : [
                    new CommandArgument({
                        Name : 'Command',
                        AltNames : ['cmd', 'command'],
                        Needed : false,
                        Type : "str",
                        Perms : null,
                    }),
                    new CommandArgument({
                        Name : 'src',
                        Needed : false,
                        Type : "bool",
                        Perms : null,
                    }),
                ]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {
        let cmd : string | undefined = this.GetArg('Command',args!)

        if(cmd) {

            let c = GetCommandFromS(cmd)

            if(!c) return {Worked:false, Error : new Error('Unable to find that command')}

            let emb = new MessageEmbed()
            emb.setAuthor(message.author.username,message.author.displayAvatarURL({dynamic:true}))
            emb.setDescription(c.Desc)
            emb.setTitle(c.Name)
            emb.setTimestamp(new Date())
            emb.setColor('#b0ffa8')
            emb.addField('Usage',`\`\`\`css\n${Prefix}${c.Name} ${c.Args ? c.Args.map(v => `-${v.Type ==='bool'? '-':''}${v.Name}${!v.Needed?'?':''}${v.Type !== 'bool'? ' '+v.Type : ''}` ).join(' ') : ''}\`\`\`\n\`-- = true?, ? = optional\``)
            emb.addField('Permissions', c.Perms?.toArray().join(', ') ?? 'No permissions')
            emb.addField('Guild only', c.Guild ? 'Yes' : 'No')
            if ( this.GetArg('src', args!) && IsIdOwner(message.author.id) ) emb.addField('src', `\`\`\`ts\n${c.run.toString().slice(0,1004).length >= 1003 ? c.run.toString().slice(0,1004) + '\n...' : c.run.toString()}\n\`\`\``)
            
            message.channel.send(emb).catch( () => message.channel.send( GetError('NO_EMBED_PERMS')) )

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
                //console.log(arr.length,emb.fields.length%3)
                if (arr.length <= 0) continue;
                emb.addField(folder[0],  arr.length <= 0 ? 'No commands!' : arr.join('\n') , emb.fields.length%3 < 2? true:false)

            }

            message.channel.send(emb).catch( () => message.channel.send( GetError('NO_EMBED_PERMS')) )

        }

        return {Worked : true}
    }

}