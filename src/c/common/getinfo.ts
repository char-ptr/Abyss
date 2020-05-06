import { Command, CommandArgument, CommandArgTypes} from "../../m/class";
import { Client, Message, GuildMember, Guild, Collection, MessageEmbed } from "discord.js";

const keyPerms = ['Kick Members','Ban Members', 'Administrator','Manage Guild','View Audit Log','Mention Everyone']

module.exports = class test extends Command 
{

    constructor(  ) 
    {

        super
        ( 
            { 
                Name : 'getinfo',
                Desc : 'Gets information about either a guild or a person.',
                Guild : false,
                Owner : false,
                Hidden : false,
                Args : 
                    [new CommandArgument({
                        Name : 'guild',
                        Needed : false,
                        Type : "str" as keyof CommandArgTypes,
                        Perms : null,
                        Position : [0],
                        same : true
                    }),
                    new CommandArgument({
                        Name : 'person',
                        Needed : false,
                        Type : "str" as keyof CommandArgTypes,
                        Perms : null,
                        Position : [0],
                        same : true
                    }),
                    new CommandArgument({
                        Name : 'member',
                        Needed : false,
                        Type : "member" as keyof CommandArgTypes,
                        Perms : null,
                        Position : [1],
                        same : false
                    }),
                ]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {
        

        if (this.GetArg('guild',args!)) {

            let emb = new MessageEmbed()
            

            return {Worked : true}

        } else if (this.GetArg('person',args!)) {

            let mem : GuildMember = this.GetArg('member',args!) ?? message.member


            let emb = new MessageEmbed()
            emb.setTitle('Information on ' + mem.displayName)
            emb.setThumbnail(mem.user.displayAvatarURL())
            emb.setColor(mem.displayHexColor)
            emb.setFooter('Requested by ' + message.member?.displayName)
            emb.addField('Roles', mem.roles.cache.map(v=>v.toString()))
            emb.addField('KeyPermissions', mem.permissions.toArray().map(v=> v.toLowerCase().split('_').map(g=>g[0].toUpperCase() + g.slice(1) ).join(' ') ).filter(v=> keyPerms.includes(v)).join(', '))
            emb.addField('Activities', mem.user.presence.activities.map((v, i)=> `[${i+1}] ${v.name} - ${v.state}`).join('\n'))
            emb.addField('Flags', mem.user.flags.toArray('').map(v=> v.toLowerCase().split('_').map(g=>g[0].toUpperCase() + g.slice(1) ).join(' ') ).join(', ') )
            emb.addField('Current vc', mem.voice.channel ?? 'Not in a vc',true)
            emb.addField('id', mem.id,true)
            emb.addField('bot', mem.user.bot,true)
            message.channel.send(emb)

            return {Worked : true}

        }


        return {Worked : false, Error : new Error('Expected a type of information to get')}
    }

}