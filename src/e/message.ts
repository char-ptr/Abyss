import {Client, Message} from "discord.js"
import {Prefix} from "../m/config";
import {Convert, GetCommandFromS, IsIdOwner} from "../m/func";
import {CommandArgTypes, CommandArgument} from "../m/class";

/**
 * 
 * @param Args The arguments (words after command) within the message.
 * @param Class The class of the argument.
 * @param message The message object which initiated the event.
 */
async function handleArg(Args : string[], Class : CommandArgument , message : Message) : Promise<[boolean , CommandArgTypes | string]>  {
    let member = message.member!
    let word : string

    if (Class.Position === 'all') word = Args.join(' ')
    else word = Args.filter( (v,i) =>   Class.Position[Class.Position.length-1] >= i && i <= Class.Position[0] ).join(' ')
    if(!word) return [false, 'Unable to find any arguments.']
    if(word.split(' ').length < (Array.isArray(Class.Position) ? Class.Position.length : 0) ) return [false,`Expected argument '${Class.Name}' @ position : ${word.split(' ').length+1} [after command]`];
    if(Class.prefix) if ( !word.startsWith(Class.prefix) ) return [false, `Expected a prefix. What it should of looked like : ${Class.prefix}${word}`]; else word = word.slice(Class.prefix.length)
    if(Class.same && word != Class.Name) return [false,`Expected the argument to be exactly the same as the argument name...`]
    if(Class.Perms) if (member.permissions.missing(Class.Perms,true) ) return [false, `You do not have the required perms to use this argument! Required perms : ${Class.Perms.toArray().join(' | ')}`]
    let conv = await Convert(word, Class.Type,message)
    if(! conv) return [false,`I was unable to convert "${word}" into typeof ${Class.Type}.`]

    return [true,conv as CommandArgTypes]

}

module.exports = async function run(client :Client, message : Message) : Promise<void> {

    if (message.content.indexOf(Prefix) !== 0) return;
    if (message.author.bot) return
    const args = message.content.slice(Prefix.length).trim().split(/ +/g);
    if (!args) return
    const comm = args.shift()!.toLowerCase();

    let cmd = GetCommandFromS(comm)

    if (! cmd) {message.channel.send('Unable to get that command!'); return}
    if (cmd.Owner) if(! IsIdOwner(message.author.id) ) {message.channel.send(`Sorry, but the command you tried to execute requires you to be an "Owner"`);return} 
    let Hargs : {name : string, value : CommandArgTypes}[] = []
    if (cmd.Args) {
        for (let i of cmd.Args) {
            let out = await handleArg(args,i, message)
            if (out[0] ) {
                Hargs = [...Hargs,{name : i.Name, value : out[1] as CommandArgTypes } ]
            }
            else if (i.Needed && !out[0]) {message.channel.send(out[1]); return void(0)}
            else if (!i.Needed && !out[0]) console.log(out)
        }
    }
    let out = await cmd.run(message,client,Hargs)
    if (!out.Worked && out.Error) {message.channel.send(out.Error.message)}
}
