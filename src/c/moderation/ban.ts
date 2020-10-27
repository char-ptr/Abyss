import {Command, CommandArgTypes, CommandArgument} from "../../m/class";
import {Client, GuildMember, Message, Permissions} from "discord.js";


module.exports = class Ban extends Command
{

    constructor(  ) 
    {

        super
        ( 
            { 
                Name    : 'ban',
                Desc    : 'well, erm say bye',
                Guild   : true,
                Owner   : false,
                Hidden  : false,
                Perms   : new Permissions('BAN_MEMBERS'),
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
                        Perms : null,
                    }),
                ]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {[x:string]:any} ) => {
        
        let banm = (this.GetArg('person',args!) as GuildMember )

        if (!banm.bannable) {
            return {Worked : false, Error : new Error("I do not have the perms to ban this user.")}
        }
        if  (! this.GetArg('silent',args!)) await banm.send(`You have been BANNED from ${message.guild!.name} for the reason of "${this.GetArg('reason',args!) ?? 'No reason.'}"`)
        banm.ban(this.GetArg('reason',args!) ?? 'No reason.')
            .then( (v) => message.channel.send(`Successfully Banned ${v.displayName} with reason of ${this.GetArg('reason',args!) ?? 'No reason.'}`),
                    re => message.channel.send('I do not have the required permissions to ban this user.'))

        return {Worked : true}
    }

}