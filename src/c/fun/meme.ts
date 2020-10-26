import {Command} from "../../m/class";
import {Client, Message, MessageEmbed} from "discord.js";
import got from "got";
import {GetError} from "../../m/error";

module.exports = class Meme extends Command
{

	constructor(  )
	{

		super
		(
			{
				Name : 'meme',
				Desc : 'Nabs a meme from dankmemes subreddit',
				Guild : false,
				Owner : false,
				Hidden : false,
			}
		)

	}

	public run = async (message : Message, client : Client, args?: {[x:string]:any} ) => {

		let jsn = JSON.parse( (await got('https://www.reddit.com/r/dankmemes/random.json') ).body )[0].data.children[0].data
		//console.log(jsn)
		let a = false
		let emb = new MessageEmbed()
		if (!jsn.is_video) emb.setImage(jsn.url)
		else emb.attachFiles(jsn.url)
		emb.setTitle(jsn.title)
		emb.setDescription('This meme was taken from *r/dankmemes*')
		emb.setURL('https://www.reddit.com'+jsn.permalink)
		message.channel.send(emb).catch( () => message.channel.send( GetError('NO_EMBED_PERMS')) )
		return {Worked : true}
	}

}