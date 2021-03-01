import {Client, Message} from "discord.js";
import {GetCommandFromS, IsIdOwner, ParseArgument, ParseStringToCommand} from "../m/func";
import {Command, RatelimitClient} from "../m/class";
// Ran on a new message

let Ratelimiter = new RatelimitClient({
	LimitPerUser : 3
})

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

	let [IsRatelimited, TimeUntil] = Ratelimiter.isRateLimited(message.author.id)
	if (IsRatelimited) {
		if (!Ratelimiter.hasSeen(message.author.id)) {
			message.channel.send("You have been ratelimited, time until expire : " +  TimeUntil/1000 + "s" )
			Ratelimiter.seen(message.author.id)
		}
		return;
	}
	else {
		Ratelimiter.add(message.author.id)
	}
	if (!message.guild && Command.Guild) {
		message.channel.send("You must be in a guild to execute this command")
		return;
	}
	//arguments
	let ArgumentMaped : {[x:string]:any} = {}
	let Needed = Command?.Args?.length ? Command.Args?.map(v=>{return {[v.Name]:false}}).reduce((v,b)=>{return{...v,...b}}) : {}
	// Get all the command arguments
	if (Needed && Command.Args?.length ) { // {} = false, populated object = true.
		// so, if there is no commands, this will not run.
		for (let arg of CommandData.Arguments) {
			let output = await ParseArgument(arg, message, Command)
			// parse the command argument and get information about it.
			if (!output) return; // if there is no output some error has occurred, so it gets skiped
			if (output.Fatal) { // if there is a fatal error we need to prevent the command from running
				message.channel.send(output.Message);
				return;
			}
			if (output.Error && ! output.Fatal) continue; // if there is an error, but it isn't fatal then just jump to the next iteration
			//  Will only happen if the argument is not needed and is missing a value
			if (!output.bool && await output.Value == null && output.CommandArg?.Type === "member") {message.channel.send("Unable to get that member"); return}
			Needed[output.CommandArg?.Name ?? "__"] = true
			ArgumentMaped[output.CommandArg?.Name ?? "__"] = !output.bool ? await output.Value : true
		}
		if (!Command.Args?.every(v=> { // checks that all of the values in the array return true, if they don't it returns false
			if (!Needed) return false;
			return Needed[v.Name] || !v.Needed
		})) { // we can assume that the command is invalid, and provide help with it.
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

	let checkOutput = Command.RunAllChecks(client,message,ArgumentMaped)
	let checkPromises = await Promise.all(checkOutput.map(v=>v.val))
	let outcheck = Command.RunAllChecks(client,message,ArgumentMaped).filter((v,idx)=> !checkPromises[idx])
	let Shouldcontinue = await checkPromises.some(v=>v)
	for (let cmd of outcheck) {
		if (!cmd.strict && Shouldcontinue) {
			continue;
		}
		message.channel.send(`You have failed the \`${cmd.name}\` Check`);
		return;
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

	message.channel.startTyping(); // start typing so in channel you can see that the bot is typing
	try {
		Command.run(message, client, ArgumentMaped).then(out=>{
			message.channel.stopTyping(); // stop typing sometimes will take longer than expected due to rate limiting
			if (!out.Worked && out.Error != undefined) {
				message.channel.send(out.Error.toString(), {
					disableMentions:"all"
				}).catch(r=>"");
			} // if it didn't work and there's and error send that error message.
		}, rej =>{
			message.channel.stopTyping(); // stop typing sometimes will take longer than expected due to rate limiting
			console.log('An error has occurred'+rej)
		})
	} catch (e) {
		message.channel.stopTyping(); // stop typing sometimes will take longer than expected due to rate limiting
		console.log('An error has occurred'+e)

	}
};
