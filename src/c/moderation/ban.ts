import { Command, CommandArgument, CommandArgTypes} from "../../m/class";
import { Client, Message, GuildMember, Guild, Collection, Permissions } from "discord.js";


module.exports = class test extends Command 
{

    constructor(  ) 
    {

        super
        ( 
            { 
                Name    : 'Bans a member',
                Desc    : 'well, erm say bye',
                Guild   : false,
                Owner   : false,
                Hidden  : false,
                Perms   : new Permissions('BAN_MEMBERS'),
                Args    : 
                    [new CommandArgument({
                        Name : 'person',
                        Needed : true,
                        Type : "member" as keyof CommandArgTypes,
                        Perms : null,
                        Position : [0]
                    }),
                    new CommandArgument({
                        Name : 'reason',
                        Needed : false,
                        Type : "str" as keyof CommandArgTypes,
                        Perms : null,
                        Position : [1],
                        same:false
                    }),
                ]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {
        
        (this.GetArg('person',args!) as GuildMember ).ban(this.GetArg('reason',args!) ?? 'No reason.').then( (v) => message.channel.send(`Successfully Banned ${v.displayName} with reason of ${this.GetArg('reason',args!) ?? 'No reason.'}`))

        return {Worked : true}
    }

}