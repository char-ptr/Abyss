import {Command, CommandArgTypes, CommandArgument} from "../../m/class";
import {Client, GuildMember, Message, Permissions} from "discord.js";


module.exports = class Kick extends Command
{

    constructor(  ) 
    {

        super
        ( 
            { 
                Name    : 'kick',
                Desc    : 'say bye to the user.',
                Guild   : false,
                Owner   : false,
                Hidden  : false,
                Perms   : new Permissions('KICK_MEMBERS'),
                Args    : 
                    [new CommandArgument({
                        Name : 'person',
                        Needed : true,
                        Type : "member" as keyof CommandArgTypes,
                        Perms : null,
                    }),
                    new CommandArgument({
                        Name : 'reason',
                        Needed : false,
                        Type : "str" as keyof CommandArgTypes,
                        Perms : null,
                    }),
                    new CommandArgument({
                        Name : 'silent',
                        Needed : false,
                        Type : "bool" as keyof CommandArgTypes,
                        Perms : null
                    }),
                ]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {[x:string]:any} ) => {
        
        let kickm = (this.GetArg('person',args!) as GuildMember )
        if  (! this.GetArg('silent',args!)) kickm.send(`You have been kicked from ${message.guild!.name} for the reason of ${this.GetArg('reason',args!) ?? 'No reason.'}`)
        kickm.kick(this.GetArg('reason',args!) ?? 'No reason.')
            .then( (v) => message.channel.send(`Successfully kicked ${v.displayName} with reason of ${this.GetArg('reason',args!) ?? 'No reason.'}`))
            .catch(() => message.channel.send('I do not have the required permissions to kick this user.'))

        return {Worked : true}
    }

}