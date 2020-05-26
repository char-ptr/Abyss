import { Command, CommandArgument, CommandArgTypes} from "../../m/class";
import { Client, Message, GuildMember, Guild, Collection, Permissions } from "discord.js";


module.exports = class test extends Command 
{

    constructor(  ) 
    {

        super
        ( 
            { 
                Name    : 'idban',
                Desc    : 'Bans the user even if they aren\'t in the server.',
                Guild   : true,
                Owner   : false,
                Hidden  : false,
                Perms   : new Permissions('BAN_MEMBERS'),
                Args    : 
                    [new CommandArgument({
                        Name : 'id',
                        Needed : true,
                        Type : "num" as keyof CommandArgTypes,
                        Perms : null,
                    }),
                ]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {
        
        let banm = (this.GetArg('id',args!) as number )
        message.guild!.members.ban(banm.toString())
            .then( () => message.channel.send(` <@${banm}> Has been successfully banned.`) )
            .catch( () => {message.channel.send(`There was an issue with banning <@${banm}>, Are you sure you entered the right id?`);  return {Worked : false, Error : new Error('Unable to find that id.')}} )

        return {Worked : true}
    }

}