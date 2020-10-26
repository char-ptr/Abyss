import {Command, CommandArgument} from "../../m/class";
import {Client, GuildChannel, Message, Permissions} from "discord.js";

/**
 *
 * Auto generated command file "purge".
 * This file was created on 24/10/2020 @ 1:34 am
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
module.exports = class purge extends Command {

    constructor() {

        super
        (
            {
                Name: 'purge',                        // The name of the command
                Desc: 'clears messages',                        // Description for the command
                Guild: true,                             // If the command can only be used in a guild
                Owner: false,                            // If the command can only be used by an owner
                Hidden: false,                            // If Hidden within the help command
                Perms: new Permissions("MANAGE_MESSAGES"),                        // Permissions require to used the command
                Alias: undefined,                        // Aliases of the command
                Nsfw: false,                            // Marks if the command should only be used in nsfw channels.
                Args:                                   // array of arguemnts
                    [
                        new CommandArgument({                           // Constructor for the command argument
                            Name: 'messages',                        // Argument Name
                            AltNames: ["m"],                               // Alternative names for this argument
                            Needed: true,                             // If the argument is required
                            Type: "num",                            // Expected value type.
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

        let Amount = this.GetArg("messages",args!)
        if (!(message.channel instanceof GuildChannel)) return {Worked: false, Error : new Error("executed in non guild channel?")}
        message.channel!.bulkDelete(Amount,true)

        return {Worked: true} // {Worked:False, Error: new Error('Error Message'))}
    }

}