import { Command, CommandArgument, CommandArgTypes} from "../../m/class";
import { Client, Message, GuildMember } from "discord.js";




module.exports = class test extends Command 
{

    constructor(  ) 
    {

        super
        ( 
            { 
                Name : 'test',
                Desc : 'Casual test to see if command handler is working.',
                Guild : false,
                Owner : true,
                Hidden : true,
                Args : [new CommandArgument({
                    Name : 'Test',
                    Needed : true,
                    Type : "bool" as keyof CommandArgTypes,
                    Perms : null,
                })]
            }
        )

    }

    public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {
        console.log('Test worked!', args)
        return {Worked : true}
    }

}