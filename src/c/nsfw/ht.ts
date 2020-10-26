import {Command, CommandArgument} from "../../m/class";
import {Client, Message} from "discord.js";
import {existsSync, readFileSync} from "fs";
import {join} from "path";

let txt : Buffer
if (existsSync(join(__dirname,'../../../Util/hData.json'))) {

	txt = readFileSync(join(__dirname,'../../../Util/hData.json'))
}else{
	txt = Buffer.from(JSON.stringify({'Normal':[],'Yuri':[]}))
}
let files : {[ley:string] : string[]} = JSON.parse(txt.toString('utf8'))



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
				Alias : ['hen'],
				Args : [
					new CommandArgument({
						Name:'amount',
						Needed:false,
						Type:'num',
						AltNames:['a']
					}),
					new CommandArgument({
						Name:'sort',
						Needed:false,
						Type:'str',
						AltNames:['s']
					}),
					new CommandArgument({
						Name:'type',
						Needed:false,
						Type:'str',
						AltNames:['t']
					}),
					new CommandArgument({
						Name:'many',
						Needed:false,
						Type:'bool',
						AltNames:['m']
					}),
					new CommandArgument({
						Name:'find',
						Needed:false,
						Type:'str',
						AltNames:['f']
					}),
					new CommandArgument({
						Name:'instant',
						Needed:false,
						Type:'bool',
						AltNames:['i']
					}),
				]
			}
		)

	}

	public run = async (message : Message, client : Client, args: {[x:string]:any} ) => {

		if (this.GetArg('many',args!)) {
			message.channel.send(`There is currently ${files['Normal'].length + files['Yuri'].length} files in DB`)
			return {Worked:true}
		}
		console.log(this.GetArg('amount',args!) > 20)
		if (this.GetArg('amount',args!) > 20) return {Worked:false, Error:new Error("You are not allowed to request more than 20 images at a time.")}

		let SearchQ : string
		if (this.GetArg('find',args!))
			SearchQ = (this.GetArg('find',args!) as string)
			.replace(/ +/g, '-')

		const generateBySort = (sort:string,file:string[],index?:number, amount?:number) : string =>{
			switch (sort) {
				case ('first'):
					return file[index??0]
				break;
				case ('last'):
					return file[file.length-1 - (index ??0) ]
				break;
				case('random'):
					return file[ Math.floor(Math.random() * file.length)]
				break;
				case('find'):
					let fil = file.filter(v=>v.includes( SearchQ ))
					return fil[(Math.floor(Math.random() * fil.length))]
				default : return ''; break;
			}
		} 
		
		const generateByType = (type:string) : string =>{
			let out = 'Normal'
			for (let key of Object.keys(files) ) {
				if (key.toLowerCase().match((type??'Normal').toLowerCase()))
				{
					out= key
					break;
				}
			}
			console.log(`using type {${out}}, types: {${Object.keys(files).join(', ')}} / ${type}`)
			return out
		} 

		let filesu : string[] = [];

		let convsdat = new Map([['r','random'],['l','last'],['f','first']])
		let convsort = (t:string)=> convsdat.get(t) ?? t

		let amount = this.GetArg("amount",args)
		let sort = convsort (this.GetArg('sort',args!))
		let type = generateByType(this.GetArg('type',args!))
		console.log(type)



		if (! sort){
			console.log('Automatically converting to random');
			sort = 'random'
		}
		for (let i =0;i<(amount ?? 1);i++){
			filesu = [
				...filesu,
				generateBySort(sort,files[type],i,amount)
			]
		}
		console.log(filesu,amount)
		if (!this.GetArg('instant',args!)) {
			message.channel.send({files:filesu}).catch(r=>{message.channel.send(`Unfortunately i was unable to send, Most likely due to being unable to match options you provided \n msg for developers: || ${r.message} ||`);console.log(r)})
		} else {
			message.channel.send(filesu.join(' | ')).catch(r=>{message.channel.send(`Unfortunately i was unable to send, Most likely due to being unable to match options you provided \n msg for developers: || ${r.message} ||`);console.log(r)})

		}
		return {Worked:true}
	}
}