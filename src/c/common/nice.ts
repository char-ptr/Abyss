import { Command, CommandArgument, CommandArgTypes} from "../../m/class";
import { Client, Message, GuildMember, Guild, Collection, MessageEmbed } from "discord.js";
import {GetError} from "../../m/error";

module.exports = class Nice extends Command
{

    constructor(  ) 
    {

        super
        ( 
            { 
                Name : 'nice',
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
                    }),
                    new CommandArgument({
                        Name : 'o',
                        Needed : false,
                        Type : "str" as keyof CommandArgTypes,
                        Perms : null,
                        prefix : '-',
                    }),
                ]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {
        
        let emb = new MessageEmbed
        emb.setThumbnail(client.user!.displayAvatarURL())
        emb.setTitle('wow totally not self promo')
        emb.addField('github', '[click](https://github.com/pozm/TS-Bot)')
        emb.setFooter('made by pozm. :)')
        message.channel.send(emb).catch( () => message.channel.send( GetError('NO_EMBED_PERMS')) )
        return {Worked : true}
    }

}