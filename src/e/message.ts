import {Client, Message} from "discord.js";
import {GetCommandFromS, IsIdOwner, ParseArgument, ParseStringToCommand} from "../m/func";
import {Command} from "../m/class";
// Ran on a new message

module.exports = async function run(
	client: Client,
	message: Message
): Promise<void> {

	// complete handling of command & its arguments
	// command
	let CommandData = ParseStringToCommand(message.content)

	if (!CommandData) return;
	if (!CommandData.Command) return;
	let Command = CommandData.Command


	//arguments
	let ArgumentMaped : {[x:string]:any} = {}
	let Needed = Command.Args?.map(v=>{return {[v.Name]:false}}).reduce((v,b)=>{return{...v,...b}})
	if (Needed) {

		for (let arg of CommandData.Arguments) {
			let output = ParseArgument(arg, message, Command)
			if (!output) return;
			if (output.Fatal) {
				message.channel.send(output.Message);
				return;
			}
			if (output.Error && ! output.Fatal) continue;
			if (!output.bool && await output.Value == null && output.CommandArg?.Type === "member") {message.channel.send("Unable to get that member"); return}
			Needed[output.CommandArg?.Name ?? "__"] = true
			ArgumentMaped[output.CommandArg?.Name ?? "__"] = !output.bool ? await output.Value : true
		}
		if (!Command.Args?.every(v=> {
			if (!Needed) return false;
			return Needed[v.Name] || !v.Needed
		})) {
			await message.channel.send("Command has invalid argument(s)")
			{await (GetCommandFromS("help") as Command).run(message,client, {"Command":Command.Name})}
			return;
		}
	}

	// Command checks based on channel types.

	switch (
		message.channel.type // do different shit based on the channel type.
	) {
		case "text":
			if (Command.Nsfw && !message.channel.nsfw) {
				message.channel.send(
					"You must be in a nsfw channel to use this command."
				);
				return;
			}
			break;
    }
    if (Command.Perms && message?.member) {
        let missing = message?.member?.permissions.missing(Command.Perms,true)
        if (missing.length) {
            message.channel.send(`You do not have the required perms to use this command! Missing perms : ${missing.join(" | ")}`)
            return;
        }
    }
	if (Command.Owner)
		if (!IsIdOwner(message.author.id)) {
			message.channel.send(
				`Sorry, but the command you tried to execute requires you to be an "Owner"`
			);
			return;
		} // disregard if the command is an owner and the message author isn't an owner.
	
	let blacklistedGuilds = ['744411529725870123']
	if (blacklistedGuilds.includes(message?.guild?.id ?? '0') && !IsIdOwner(message.author.id)) return;

	message.channel.startTyping(); // start typing so in channel you can see that the bot is typing
	let out = await Command.run(message, client, ArgumentMaped); // run the command and wait until its finished
	message.channel.stopTyping(); // stop typing sometimes will take longer than expected due to rate limiting
	if (!out.Worked && out.Error != undefined) {
		message.channel.send(out.Error.toString());
	} // if it didn't work and there's and error send that error message.
};
