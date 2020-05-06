import { Command, CommandArgument, CommandArgTypes} from "../../m/class";
import { Client, Message, GuildMember, Guild, Collection } from "discord.js";

const CurrentWhitelist = ['288062966803333120']


module.exports = class test extends Command 
{

    constructor(  ) 
    {

        super
        ( 
            { 
                Name : 'getinvite',
                Desc : 'Gets an invitation to a guild (server)',
                Guild : false,
                Owner : false,
                Hidden : false,
                Args : 
                    [new CommandArgument({
                        Name : 'guild',
                        Needed : false,
                        Type : "str" as keyof CommandArgTypes,
                        Perms : null,
                        Position : 'all'
                    }),
                    new CommandArgument({
                        Name : 'o',
                        Needed : false,
                        Type : "str" as keyof CommandArgTypes,
                        Perms : null,
                        Position : [0],
                        prefix : '-',
                        same:true
                    }),
                ]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {
        
        let guid = this.GetArg('guild',args!)

        if (!CurrentWhitelist.includes(message.author.id)) return {Worked : false, Error : new Error(await client.generateInvite('ADMINISTRATOR'))}

        if (this.GetArg('o',args!)) {message.channel.send(await client.generateInvite('ADMINISTRATOR'));return {Worked : true} }

        let guilds : Guild[] = await (await client.shard!.broadcastEval('this.guilds.cache') )[0]

        if (!guid) {

            message.channel.send(`I was unable to see what guild you wanted, So heres a list of all the guilds im currently in!:\n\`\`\`json\n${guilds.map((v : Guild)=>v.name + ` [${v.id}]`).join(', ')}\n\`\`\` `)

        } else {

            let con : false | Guild = false

            if(guilds.find(v => v.id === guid) ) con = guilds.find(v => v.id === guid)!
            else if (guilds.filter(v => v.name.match(guid) ? true : false )[0]) con = guilds.filter(v => v.name.match(guid) ? true : false )[0]!
            if(!con) return {Worked : false, Error : new Error('Unable to find that guild, Sorry!')}
            let con2 = client.guilds.resolve(con.id)!
            message.channel.send(await  (await con2.channels.cache.filter(v=>v.type === 'text').first()!.createInvite( {maxUses:1,reason:'Requested'} )).url )
        }

        return {Worked : true}
    }

}