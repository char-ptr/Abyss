import { Client, Message } from "discord.js";
import { Command, CommandArgTypes, CommandArgument } from "../m/class";
import { Prefix } from "../m/config";
import { GetError } from "../m/error";
import { Convert, GetCommandFromS, IsIdOwner } from "../m/func";

let ArgRex = /-+(?<name>\S*.)(?<value>[^-]*)?/gm;
let ArgRex2 = /( |[,])((?<name>\w[^,]+) ?= ?)(?<value>.[^,]*)/gm;

function GetArgumentFromString(s: string, args: CommandArgument[]) {
	let valu;
	for (let i in args) {
		let v = args[i];
		if (v.AltNames) if (v.AltNames?.indexOf(s) >= 0) valu = v;
		if (v.Name === s) valu = v;
	}
	return valu;
}

/**
 *
 * @description Used to handle the arguments which are passed into the command.
 * @param Args The arguments (words after command) within the message.
 * @param cmd The class of the argument.
 * @param message The message object which initiated the event.
 */
async function handleArg(
	Args: string[],
	cmd: Command,
	message: Message
): Promise<{
	[key: string]: { Complete: boolean; Value: CommandArgTypes; Msg?: string };
}> {
	let member = message.member;
	let CollArgs = {};

	for (let Argi in Args) {
		let Arg = Args[Argi]; // get arg
		let argName = Arg.split(" ")[0] ?? Arg; // get the name of the argument
		let ParArgName = argName.replace(/[-=]*/, "").trim(); // parse it, so remove the - / -- at the beginning
		let Class = GetArgumentFromString(ParArgName, cmd.Args!); //See if theres a argument with that name in the command.
		if (!Class) continue; // if not continue the search.
		// Arg = Arg.replace(/= /gm, "").trim();
		let args = Arg.split(" ");
		args.splice(0, 1); // get the argument value.
		let JoinedArgs = args.join(" "); //Join it
		let bool = argName.startsWith("--"); // Check if its a bool value.

		if (!args && !bool)
			CollArgs = {
				...CollArgs,
				[ParArgName]: {
					Completed: false,
					Msg: "Bad argument, got nothing.",
				},
            };
		if (Class.Perms && member)
			if (member.permissions.missing(Class.Perms, true).length)
				CollArgs = {
					...CollArgs,
					[ParArgName]: {
						Completed: false,
						Msg: `You do not have the required perms to use this argument! Required perms : ${Class.Perms.toArray().join(
							" | "
						)}`,
					},
				};
		let conv = await Convert(JoinedArgs, Class.Type, message);
		if (!conv && !bool)
			CollArgs = {
				...CollArgs,
				[ParArgName]: {
					Completed: false,
					Msg: `I was unable to convert "${JoinedArgs}" into typeof ${Class.Type}.`,
				},
			};
		if (bool) conv = true as CommandArgTypes;
		CollArgs = {
			...CollArgs,
			[Class.Name]: {
				Complete: true,
				Value: conv,
			},
		};
	}
	return CollArgs;
}

// Ran on a new message

module.exports = async function run(
	client: Client,
	message: Message
): Promise<void> {
	// Getting the arguments passed into the command.

	if (message.content.indexOf(Prefix) !== 0) return; // checks if the first character is the prefix
	if (message.author.bot) return; // disregards the message if the message was from a bot.
	const args = message.content
		.slice(Prefix.length) // gets the message and slices the prefix
		.trim()
		.split(/ +/g); //splits the message content where ever a space was.
	if (!args) return; // disregard if no args

	// Getting command object

	const comm = args.shift()!.toLowerCase(); // get the command name.
	if (!comm || comm === "") return;
	let cmd = GetCommandFromS(comm); // Get the command object from the command name
	if (!cmd) {
		message.channel.send("Unable to get that command!");
		return;
	} // disregard if unable to find the command object.

	// Command checks based on channel types.

	switch (
		message.channel.type // do different shit based on the channel type.
	) {
		case "text":
			if (cmd.Nsfw && !message.channel.nsfw) {
				message.channel.send(
					"You must be in a nsfw channel to use this command."
				);
				return;
			}
			break;
    }
    if (cmd.Perms && message?.member) {
        let missing = message?.member?.permissions.missing(cmd.Perms,true)
        if (missing.length) {
            message.channel.send(`You do not have the required perms to use this command! Missing perms : ${missing.join(" | ")}`)
            return;
        }
    }
	if (cmd.Owner)
		if (!IsIdOwner(message.author.id)) {
			message.channel.send(
				`Sorry, but the command you tried to execute requires you to be an "Owner"`
			);
			return;
		} // disregard if the command is an owner and the message author isn't an owner.

	// Beginning of argument handling

	let Hargs: { name: string; value: CommandArgTypes }[] = []; // currently stored arguemnts
	if (cmd.Args) {
		// check if the command requires an args
		let matcc = message.content.match(ArgRex) // check if the message matches the argument regex
			? message.content.match(ArgRex)!.map((v) => v.trim()) // if so map it an trim it.
			: message.content.match(ArgRex2)
			? message.content.match(ArgRex2)!.map((v) => v.trim())
			: null; // else its null.
		if (!(cmd.Args.length <= 0)) {
			// another check to see if arguments

			let transargs: {
				// arg format.
				[unknown: string]: {
					Needed: boolean;
					value: unknown;
					Msg?: unknown;
				};
			} = {};
			for (let argC of cmd.Args) {
				// for each arg run the following code

				transargs = {
					...transargs,
					[argC.Name]: {
						Needed: argC.Needed,
						value: null,
					},
				};
			}
			if (matcc) {
				let out = await handleArg(matcc, cmd, message); // get the command argument response
				for (let argssi in Object.keys(out)) {
					// looping over the keys of the output
					let argss = Object.values(out)[argssi]; // getting the value by the key
					let name = Object.keys(out)[argssi]; // setting key name to a more understandable variable
					if (!argss.Complete) continue; // if the argument is incomplete / invalid then ignore this loop
					let index = Object.keys(transargs).indexOf(name); // get the index
					if (name in transargs) {
						// check if the arg is in the exemplar obj check
						let val = transargs[Object.keys(transargs)[index]]; //get the value in exemplar obj check
						transargs[Object.keys(transargs)[index]] = {
							// update exemplar obj to now have current args
							Needed: val.Needed, // from old
							value: argss.Value as CommandArgTypes, // the returned argument
							Msg: argss.Msg, // the message which gets returned. is usually only used when error has occurred
						};
					}
				}
			}
			for (let i of Object.keys(transargs)) {
				// going over all the keys in trans arg (main handled arguments) to check if there's an error in any.
				if (!transargs.hasOwnProperty(i)) return; // if the property somehow doesn't exist return.
				let v = transargs[i]; // get the value from the index / key
				if (v.Needed && !v.value) {
					// check if the argument is needed, if so it also checks if there is a value if not it will follow the code below.
					message.channel.send(v.Msg ?? "" + GetError("BAD_ARG")); // send a message saying that the user inputted a bad argument
					await (GetCommandFromS("help") as Command) // get the help command
						.run(
							// and run it
							message, // default message
							client, // the discord client
							[
								{
									// the args, we're going to manually pass the command which was going to be used and its "command"
									name: "Command", // selects the argument "command" as the one this obj will handle
									value: cmd.Name as CommandArgTypes, // and sets the cmd as its value.
								},
							]
						);
					return; // return to prevent other code from running as there is an error with the argument and will cause errors in main code which is ran in the command
				}
				Hargs =
					// sets the actual obj which is going to be sent to the things in transarg.
					[
						...Hargs, // old content of this array
						{
							name: i, // key
							value: v.value as CommandArgTypes, // value
						},
					];
			}
		}
	}
	message.channel.startTyping(); // start typing so in channel you can see that the bot is typing
	let out = await cmd.run(message, client, Hargs); // run the command and wait until its finished
	message.channel.stopTyping(); // stop typing sometimes will take longer than expected due to rate limiting
	if (!out.Worked && out.Error) {
		message.channel.send(out.Error.message);
	} // if it didn't work and there's and error send that error message.
};
