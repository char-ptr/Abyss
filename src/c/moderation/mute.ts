import {Command, CommandArgTypes, CommandArgument} from "../../m/class";
import {Client, GuildMember, Message, Permissions} from "discord.js";

/**
 *
 * Auto generated command file "mute".
 * This file was created on 28/05/2020 @ 3:21 am
 * This file was made for Bot-Typescript
 *
 */

module.exports = class Mute extends Command {

	constructor() {

		super
		(
			{
				Name: 'mute',
				Desc: 'Mutes a user.',
				Guild: true,
				Owner: false,
				Hidden: false,
				Perms: new Permissions('MANAGE_GUILD'),
				Args:
					[
						new CommandArgument({
							Name: 'user',
							Needed: true,
							Type: "member" as keyof CommandArgTypes,
							Perms: null,
							AltNames:['u']
						}),
						new CommandArgument({
							Name: 'minutes',
							Needed: true,
							Type: "num" as keyof CommandArgTypes,
							Perms: null,
							AltNames:['m']
						}),
						new CommandArgument({
							Name: 'reason',
							Needed: false,
							Type: "str" as keyof CommandArgTypes,
							Perms: null,
							AltNames:['r']
						}),
					]
			}
		)

	}

	public run = async (message : Message, client : Client, args?: {[x:string]:any} ) => {

		let MuteRole = message.guild!.roles.cache.find(role => role.name === 'Muted⁝')

		if (!MuteRole) {

			MuteRole = await message.guild!.roles.create(
			{
				data:
				{
					color:"DARK_RED",
					name:'Muted⁝',
				}
			})

			if (!MuteRole) return {Worked:false, Error:new Error('Unable to make Role. Check the permissions.')}


			for (let [id, channel] of message.guild!.channels.cache) {
				await (channel.createOverwrite(MuteRole,{
					SEND_MESSAGES:false
				}).catch( () => {return {Worked:false, Error:new Error('Unable to make channel overwrites. Check the permissions.')} } ) )
			}
		}

		console.log(MuteRole)

		if(!MuteRole) return {Worked:false, Error:new Error('Something went wrong, i was unable to get the mute role..')}

		let user = this.GetArg('user',args!) as GuildMember
		let reason = this.GetArg('reason',args!) as string ?? 'No reason'
		let time = this.GetArg('minutes',args!) as number

		(await user.roles.add(MuteRole, `[Mute on behalf of ${message.author.username}] - ${reason}`).catch(()=> message.channel.send('Something went wrong while adding the mute role.')))
		await message.channel.send(`Successfully muted ${user} for ${time} minutes with the reasoning of ${reason ?? 'No reason'}`)
		setTimeout( ()=>user.roles.remove(MuteRole!,`[Automated unmute]`), time*60000)

		return {Worked: true}
	}	// @todo make this save to db

}