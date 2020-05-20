import { Command, CommandArgument, CommandArgTypes} from "../../m/class";
import { Client, Message, GuildMember, MessageEmbed, MessageAttachment } from "discord.js";
import got from "got";
import {getrnd} from "../../m/func";
import {GetError} from "../../m/error";

let stored : any
let cannew = true

function getFile(jsn : any) : any {
	let dat = jsn.data
	let meta = jsn.meta
	let cat =  Math.floor( Math.random() * (dat.length-1) )
	//console.log(cat,dat[cat])
	let ind = dat[cat][Math.floor( Math.random() * (dat[cat].length-1) )]
	if(!ind) return getFile(jsn)
	return ind

}


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
				nsfw  : true,
				Alias : ['hen']
			}
		)

	}

	public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {
		return {Worked : false, Error : new Error('Command is currently broken, may be fixed in the future')}
		console.log(!cannew? 'Data is stored in cache so it\'s being used' : 'Data isn\'t stored in cache so going to request and cache.')
		if (cannew) {
			cannew = false
			let index = getrnd(0, 2000)
			console.log('sending request', index)
			let res = (await got(`https://hr.hanime.tv/api/v8/community_uploads?channel_name__in[]=nsfw-general&__offset=${index}&__order=created_at,DESC&loc=https://hanime.tv`).catch(e=>{console.log(e);return e}) )
			console.log(res)
			res = res.body
			if (!res) return {
				Worked: false,
				Error: new Error('There was an issue contacting the api, try again later?')
			}
			let jsn = JSON.parse(res)
			if (!jsn) return {
				Worked: false,
				Error: new Error('There was an issue contacting the api, try again later?')
			}
			if (!stored) {stored = jsn;stored.data = [stored.data]} else { if (stored.data.indexOf([jsn.data]) < 0) stored.data = [...stored.data, [...jsn.data]]; else console.log('Already indexed..')}
			stored.meta += jsn.meta
			setTimeout( () => {cannew = true},5e3 )
			setTimeout( () => {stored.data.splice(0,1)},15e3 )
		}
		let jsn = stored
		console.log(jsn.data.map((v:any)=>v.map((v2:any) => v2.id ) ) )
		let meta = jsn.meta
		if(meta.error) {console.error(meta.error); return {Worked : false,Error:new Error('There was an issue contacting the api, try again later?')}}
		let dat = getFile(jsn)

		await message.channel.send( new MessageEmbed().setImage(dat.url).setDescription(`There is currently a ${ Number( ( 1 / (24*(stored.data.length as number)) ).toFixed(2))*10 }% chance of a duplicate`) ).catch( () => message.channel.send( GetError('NO_EMBED_PERMS')) )
		return {Worked : true}
	}

}