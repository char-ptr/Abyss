import {Command, CommandArgument, CommandArgTypes, Inventory, Weapon} from "../../m/class";
import {Client, Message, GuildMember, Guild, Collection, MessageEmbed, TextChannel} from "discord.js";
import {getrnd, sleep} from "../../m/func";

const yphrases = /(yeah|ok|okay|yes|ya|sure)/gmi
const nphrases = /(nah|nope|no)/gmi
let Cl : Client
class PlayerData {

	readonly Id : string
	public Inv : Inventory
	public Health : number
	readonly Channel : TextChannel
	public CritCh : number = 13
	public DamageBoot : number = 0
	public skipped : number = 0
	constructor( {id,inv,health,channel} : {id:string,inv:Inventory,health:number,channel:TextChannel} ) {
		this.Id = id
		this.Inv = inv
		this.Health = health
		this.Channel = channel
	}

}

async function choose(Data : PlayerData, messg : Message) : Promise<Weapon | void> {
	let emb = new MessageEmbed()
	emb.setTitle(`${Data.Channel.guild.member(Data.Id)!.displayName}'s turn.`)
	emb.setColor("AQUA")
	emb.setDescription(`Okay, ${ (Cl.users.resolve(Data.Id) )!.toString() }, Its your turn. What weapon would you like to use:`)
	for (let ind in Data.Inv.Equipped!) {
		emb.addField('\u200B',`${Number(ind)+1}: ${Data.Inv.Equipped![ind].Name} ⚔${Data.Inv.Equipped![ind].Damage.modified} ~ ${Data.Inv.Equipped![ind].HitChance}%`)
	}
	await messg.edit(emb)
	let msg = (await Data.Channel.awaitMessages((m : Message) => m.member!.id == Data.Id && ! isNaN( +m.content ) && +m.content -1 in Data.Inv.Equipped!, {dispose:true,max:1,time:15e3})).first()
	if (!msg) return
	let wep = Data.Inv.Equipped![ Number(msg.content) -1]
	await msg.delete()
	return wep
}
async function onDeath(Winner:PlayerData,Loser:PlayerData,Mess:Message, extraData? : {reason : string}) : Promise<void> {

	let emb = new MessageEmbed()
	emb.setDescription(
		`${Winner.Channel.guild.member(Winner.Id)!.displayName} Has won the fight!`
	)
	emb.addField('Statistics',`
		${Winner.Channel.guild.member(Winner.Id)!.displayName}'s heath : ${Winner.Health}
		${Winner.Channel.guild.member(Loser.Id)!.displayName}'s health : ${Loser.Health}
		${extraData ? `Reason for ending : ${extraData.reason}` : ''}
	`)
	emb.setColor("GOLD")
	emb.setImage(Cl.users.resolve(Winner.Id)!.displayAvatarURL({dynamic:true,size:128}))
	emb.setTitle('End')
	await Mess.edit(emb)
	return

}

async function main(currData : PlayerData,oppData : PlayerData, messg : Message) : Promise<any> {
	if (oppData.Health <=0) return onDeath(currData,oppData,messg)
	else if (currData.Health <=0) return onDeath(oppData,currData,messg)
	let weapon = await choose(currData,messg)
	console.log('Got',weapon)
	if(!weapon && currData.skipped >= 2) {return await onDeath(oppData,currData,messg, {reason : `${currData.Channel.guild.member(currData.Id)!.displayName} had their turn skipped too many times..`} ) }
	if (!weapon) {await currData.Channel.send(`You took too long to enter a vaild weapon, therefore the turn has been passed onto ${ (Cl.users.resolve(oppData.Id) )!.toString()}`).then(m=>m.delete({timeout:5e3})); currData.skipped++ ; return await main(oppData,currData,messg)}
	currData.skipped = 0
	let Chance  = getrnd(0,100)
	let gotHit  : boolean = false
	let gotcrit : boolean = false
	if (currData.CritCh  >= Chance) {currData.DamageBoot += (30 /100) * weapon.Damage.modified;gotcrit=true}
	if (weapon.HitChance >= Chance) gotHit=true

	if(gotHit) oppData.Health -= (weapon.Damage.modified + currData.DamageBoot)

	let emb = new MessageEmbed()
	emb.setColor("RED")
	emb.setTitle(`${currData.Channel.guild.member(currData.Id)!.displayName}'s turn.`)
	if(gotHit)  emb.setDescription(`
	${currData.Channel.guild.member(currData.Id)!.displayName} Has hit ${oppData.Channel.guild.member(oppData.Id)!.displayName} for ${(weapon.Damage.modified + currData.DamageBoot)} (${gotcrit ?'with' : 'without'} Critical) damage.
	${oppData.Channel.guild.member(oppData.Id)!.displayName}'s Health is now at ${oppData.Health}
	`)
	else emb.setDescription(`${currData.Channel.guild.member(currData.Id)!.displayName} Has missed with their attempt to hit ${oppData.Channel.guild.member(oppData.Id)!.displayName}`)
	emb.setImage(Cl.users.resolve(currData.Id)!.displayAvatarURL({dynamic:true,size:64}))
	await messg.edit(emb)
	sleep(4e3)
	return await main(oppData,currData,messg)
}

module.exports = class test extends Command
{

	constructor(  )
	{

		super
		(
			{
				Name : 'get info',
				Desc : 'Gets information about either a guild or a person.',
				Guild : true,
				Owner : false,
				Hidden : false,
				Args :
					[
						new CommandArgument({
							Name : 'opponent',
							Needed : true,
							Type : "member" as keyof CommandArgTypes,
							Perms : null,
							Position : [0],
							same : false
						}),
					]
			}
		)

	}

	public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ) => {

		let opp = this.GetArg('opponent',args!) as GuildMember
		if(opp.user.bot) return {Worked:false,Error:new Error('You cannot fight bots!')}
		if (message.member === opp) return {Worked:false,Error:new Error('You cannot fight yourself!')}
		let emb = new MessageEmbed()
		emb.setTitle('Fight')
		emb.setColor("ORANGE")
		emb.setDescription(`Awaiting ${opp.displayName}'s response....`)
		emb.setFooter(`Started by ${message.member!.displayName}.`,message.author.displayAvatarURL({dynamic:true,size:32}))
		let embmess = await message.channel.send(emb)

		//await message.channel.send(`${opp.toString()} Would you like to fight ${message.member?.displayName}?`)
		let msg = (await message.channel.awaitMessages( m => ( m.content.match(yphrases) || m.content.match(nphrases) ) && m.author.id === opp.id, {dispose:true,max:1,time:15e3}) ).first()
		if(!msg) {emb.setDescription(`${opp.displayName} has taken too long to respond, so this fight has automatically been canceled.`); await message.react('❌') ; await embmess.edit(emb);  return {Worked : true} }

		console.log('Passed!')

		if (msg.content.match(nphrases)) {emb.setDescription('Fight has been canceled.'); emb.setColor("DARK_RED"); await msg.delete(); message.react('❌') ; await embmess.edit(emb); return  {Worked:true}}
		await msg.delete();
		await message.react('✔')
		emb.setDescription('Fight is starting!')
		emb.setColor("GREEN")
		await embmess.edit(emb)
		Cl = client
		let meminv      = new Inventory({Weapons : [new Weapon({Name:'stick',Damage:5,Droppable:false, HitChance : 98})] })
		let oppinv      = new Inventory({Weapons : [new Weapon({Name:'stick',Damage:5,Droppable:false, HitChance : 98})] })
		let StarterData = new PlayerData( {id:message.member!.id, inv : meminv,health:10, channel : message.channel as TextChannel } )
		let OppData     = new PlayerData( {id:opp.id, inv : oppinv,health:10, channel : message.channel as TextChannel} )

		await main(StarterData,OppData,embmess)

		return {Worked : true}
	}

}