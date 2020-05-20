import {Client, Message} from "discord.js"
import {Prefix} from "../m/config";
import {Convert, GetCommandFromS, IsIdOwner} from "../m/func";
import {Command, CommandArgTypes, CommandArgument} from "../m/class";
import {GetError} from "../m/error";

let ArgRex = /-+(\S*.)([^-]*)?/gm


function GetArgumentFromString(s : string, args : CommandArgument[]) {

    return args.filter(v=> v.Name === s)[0]

}

/**
 *
 * @param Args The arguments (words after command) within the message.
 * @param Class The class of the argument.
 * @param message The message object which initiated the event.
 */
async function handleArg(Args : string[], cmd : Command , message : Message) : Promise<object>  {
    let member = message.member
    if(!Args) return [false,'No argument']
    let CollArgs = {}

    for (let Argi in Args) {

        let Arg = Args[Argi] // get arg
        let argName = Arg.split(' ')[0] ?? Arg // get the name of the argument
        let ParArgName = argName.replace(/-*/, '') // parse it, so remove the - / -- at the beginning
        let Class = GetArgumentFromString(ParArgName,cmd.Args!) //See if theres a argument with that name in the command.
        if (!Class) continue // if not continue the search.
        let args = Arg.split(' ');args.splice(0, 1) // get the argument value.
        let JoinedArgs = args.join(' ') //Join it
        let bool = argName.startsWith('--') // Check if its a bool value.


        console.log(argName, args, JoinedArgs, bool)

        if (!args && !bool) CollArgs = {...CollArgs, [ParArgName] : { Completed : false, Msg: 'Bad argument, got nothing.'} }
        if (Class.Perms && member) if(member.permissions.missing(Class.Perms, true)) CollArgs = {...CollArgs, [ParArgName] : { Completed : false, Msg: `You do not have the required perms to use this argument! Required perms : ${Class.Perms.toArray().join(' | ')}`} }
        let conv = await Convert(JoinedArgs, Class.Type, message)
        if (!conv && !bool) CollArgs = {...CollArgs, [ParArgName] : { Completed : false, Msg: `I was unable to convert "${JoinedArgs}" into typeof ${Class.Type}.`} }
        if (bool) conv = true as CommandArgTypes
        CollArgs = {...CollArgs, [ParArgName] : {Complete : true,Value : conv}}
    }
    return CollArgs
}

module.exports = async function run(client :Client, message : Message) : Promise<void> {

    if (message.content.indexOf(Prefix) !== 0) return;
    if (message.author.bot) return
    const args = message.content.slice(Prefix.length).trim().split(/ +/g);
    if (!args) return
    const comm = args.shift()!.toLowerCase();

    let cmd = GetCommandFromS(comm)
    if (! cmd) {message.channel.send('Unable to get that command!'); return}
    switch(message.channel.type) {

        case "text":
            if (cmd.nsfw && !message.channel.nsfw) {message.channel.send('You must be in a nsfw channel to use this command.'); return}

    }
    if (cmd.Owner) if(! IsIdOwner(message.author.id) ) {message.channel.send(`Sorry, but the command you tried to execute requires you to be an "Owner"`);return}
    let Hargs : {name : string, value : CommandArgTypes}[] = []
    if (cmd.Args) {
        let matcc = message.content.match(ArgRex) ? message.content.match(ArgRex)!.map(v=>v.trim()) : null
        console.log(matcc, cmd.Args.length)
        if (!(cmd.Args.length <= 0)) {
            let transargs : object = {}
            for (let argC of cmd.Args) {

                transargs = {...transargs,[argC.Name] : {Needed : argC.Needed, value : null}}

            }

            if (matcc) {
                let out = await handleArg(matcc, cmd, message)
                console.log(out, 'out')
                for (let argss of Object.keys(out)) {
                    console.log(argss)
                    // @ts-ignore
                    if (!out[argss].Complete ) continue;
                    if ( argss in transargs ) {
                        // @ts-ignore
                        transargs[argss] = {Needed : transargs[argss].Needed,value : out[argss].Value as CommandArgTypes, Msg : out[argss].Msg}

                    }

                }
            }
            for (let i of Object.keys(transargs) ) {

                // @ts-ignore
                let v = transargs[i]
                if (v.Needed && !v.value) {message.channel.send(v.Msg); return }
                Hargs = [...Hargs,{name : i,value : v.value as CommandArgTypes}]
            }
        }
    }
    let out = await cmd.run(message,client,Hargs)
    if (!out.Worked && out.Error) {message.channel.send(out.Error.message)}
}
