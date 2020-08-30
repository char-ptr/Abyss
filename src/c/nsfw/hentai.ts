import {Command, CommandArgTypes} from "../../m/class";
import {Client, Message, MessageEmbed} from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

const dir = 'D:\\Media\\Pictures\\Web documentation\\Hentai\\Normal'

let files = readdirSync(dir)

module.exports = class test extends Command
{

	constructor(  )
	{

		super
		(
			{
				Name  : 'hentai',
				Desc  : 'Gets a random hentai image.',
				Guild : false,
				Owner : false,
				Hidden: true,
				Nsfw  : true,
				Alias : ['hen']
			}
		)

	}

	public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {

		message.channel.send({files:[
			join(dir, '/'+files[ Math.floor(Math.random() * files.length)])
		]}).catch(r=>{message.channel.send('Unfortunately i was unable to send, this is likely due to the file being too large.');console.log(r)})

		return {Worked:true}
	}
}