import {Command, CommandArgTypes, CommandArgument} from "../../m/class";
import {Client, Message} from "discord.js";


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

    public run = async (message : Message, client : Client, args?: {[x:string]:any} ) => {
        console.log('Test worked!', args)
        return {Worked : true}
    }

}