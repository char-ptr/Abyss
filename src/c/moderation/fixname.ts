import {Command, CommandArgTypes, CommandArgument} from "../../m/class";
import {Client, GuildMember, Message, Permissions} from "discord.js";

/**
 *
 * Auto generated command file "fixname".
 * This file was created on 18/07/2020 @ 11:18 pm
 * This file was made for Abyss
 * This file was made by Pozm
 *
 */

/**

 Pre functions
 •Where function that will be used later on within the command are placed.

 **/

/**

 Constructor
 •For Command handler
 •Command Information

 **/
module.exports = class fixname extends Command {

    constructor() {

        super
        (
            {
                Name: 'fixname',                        // The name of the command
                Desc: 'Fixes the user\'s username if it has any "unpingable" characters in it.',                        // Description for the command
                Guild: true,                             // If the command can only be used in a guild
                Owner: false,                            // If the command can only be used by an owner
                Hidden: false,                            // If Hidden within the help command
                Perms: new Permissions('MANAGE_NICKNAMES'),                             // Permissions require to used the command
                Alias: undefined,                             // Aliases of the command
                Nsfw: false,                            // Marks if the command should only be used in nsfw channels.
                Args:                                   // array of arguemnts
                    [
                        new CommandArgument({                           // Constructor for the command argument
                            Name: 'member',                        // Argument Name
                            AltNames: [],                                // Alternative names for this argument
                            Needed: true,                             // If the argument is required
                            Type: "member" as keyof CommandArgTypes,   // Expected value type.
                            prefix: undefined,                                // What needs to be infront of the argument, kinda deprecated
                            Perms: null,                             // Required permssions to execute this argument.
                        }),                                             // You can add another one of these on the next line
                    ]
            }
        )

    }

    /**

     Called when command is called.
     •Should always have a return.
     **/
    public run = async (message : Message, client : Client, args?: {[x:string]:any} ) => {

        let member = this.GetArg('member',args!) as GuildMember

        const DetectionRegex = /[^!-~ ]/gm

        let fixed = member.displayName.replace(DetectionRegex,'')

        member.setNickname(fixed == '' ?'No Name #'+member.user.discriminator : fixed).then(m=>message.channel.send("Changed nickname to " + fixed),reason => message.channel.send("Invalid perms to change nickname"))

        return {Worked: true} // {Worked:False, Error: new Error('Error Message'))}
    }

}