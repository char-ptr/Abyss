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
                Name : 'get info',
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
            let g = message.guild
            let emb = new MessageEmbed()
            emb.setTitle('Information on ' + g?.name)
            emb.setThumbnail(g!.iconURL() ?? '')
            emb.addField('cached roles', g?.roles.cache.map(v=>v.toString()).join(', ') ) 
            emb.addField('cached members', g?.members.cache.filter(v=>!v.user.bot).size,true)
            emb.addField('cached bots', g?.members.cache.filter(v=>v.user.bot).size,true)
            emb.addField('cached channels', g?.channels.cache.size,true)
            emb.addField('Verified?', g?.verified ? 'yes' : 'no',true)
            emb.addField('Partnered?', g?.partnered ? 'yes' : 'no',true)
            emb.addField('Boosts', g?.premiumSubscriptionCount,true)
            emb.addField('Owner', client.users.resolve(g!.ownerID)?.toString())
            message.channel.send(emb)

            return {Worked : true}

        } else if (this.GetArg('person',args!)) {

            let mem : GuildMember = this.GetArg('member',args!) ?? message.member


            let emb = new MessageEmbed()
            emb.setTitle('Information on ' + mem.displayName)
            emb.setThumbnail(mem.user.displayAvatarURL())
            emb.setColor(mem.displayHexColor)
            emb.setFooter('Requested by ' + message.member?.displayName)
            emb.addField('Roles', mem.roles.cache.map(v=>v.toString()).join(', ') )
            emb.addField('KeyPermissions', mem.permissions.toArray().map(v=> v.toLowerCase().split('_').map(g=>g[0].toUpperCase() + g.slice(1) ).join(' ') ).filter(v=> keyPerms.includes(v)).join(', ') || 'None')
            emb.addField('Activities', mem.user.presence.activities.map((v, i)=> `[${i+1}] ${v.name} @ (${v.details} - ${v.state})`).join('\n') || 'None')
            emb.addField('Flags', mem.user.bot ? 'None' : mem.user.flags.toArray().map(v=> v.toLowerCase().split('_').map(g=>g[0].toUpperCase() + g.slice(1) ).join(' ') ).join(', ') || 'None')
            emb.addField('Current vc', mem.voice.channel ?? 'Not in a vc',true)
            emb.addField('id', mem.id,true)
            emb.addField('bot', mem.user.bot,true)
            emb.addField('Status', Object.keys(mem.presence.clientStatus ?? {}).join(', ') ? `${mem.presence.status} - ${Object.keys(mem.presence.clientStatus!).join(', ')}` : mem.presence.status !== 'offline' ? 'Selfbot' : 'Offline.')
            message.channel.send(emb)

            return {Worked : true}

        }


        return {Worked : false, Error : new Error('Expected a type of information to get')}
    }

}