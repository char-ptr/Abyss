import {Command, CommandArgTypes, CommandArgument, Effect, Inventory, PlayerData, Weapon} from "../../m/class";
import {Client, GuildMember, Message, MessageEmbed, TextChannel} from "discord.js";
import {getrnd, IsIdOwner} from "../../m/func";
import {GetError} from "../../m/error";

const yphrases = /(yeah|ok|okay|yes|ya|sure)/gmi
const nphrases = /(nah|nope|no)/gmi
let Cl : Client

async function choose(Data : PlayerData, messg : Message) : Promise<Weapon | void> {
	let emb = new MessageEmbed()
	emb.setTitle(`${Data.Channel.guild.member(Data.Id)!.displayName}'s turn.`)
	emb.setColor("AQUA")
	emb.setDescription(`Okay, ${ (Cl.users.resolve(Data.Id) )!.toString() }, Its your turn. What weapon would you like to use:`)
	for (let ind in Data.Inv.Equipped!) {
		emb.addField(Number(ind)+1,`Name:${Data.Inv.Equipped![ind].Name}\nDamage:${Data.Inv.Equipped![ind].Damage.modified}\nHitChance:${Data.Inv.Equipped![ind].HitChance}%\nEffect(s):\n${Data.Inv.Equipped![ind].Effect ? `\n${Data.Inv.Equipped![ind].Effect!.name}:\n\tRounds:${Data.Inv.Equipped![ind].Effect!.rounds}\n\tTarget:${Data.Inv.Equipped![ind].Effect!.to.Target}\n\t${Data.Inv.Equipped![ind].Effect!.to.Target}'s${Data.Inv.Equipped![ind].Effect!.to.ValueOf} ${Data.Inv.Equipped![ind].Effect!.to.Opr} ${Data.Inv.Equipped![ind].Effect!.vPerRound}` : 'None'}`,true)
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
	if (currData.CritCh  >= Chance) {currData.addBoostDamage('Crit', (30 /100) * weapon.Damage.modified);gotcrit=true}
	if (weapon.HitChance >= Chance) gotHit=true

	let PreData = {curr : currData,opp:oppData}
	let Damage = (weapon.Damage.modified + currData.DamageBoost)
	if(gotHit) {oppData.Health -= Damage; if (weapon.Effect) {
		let Inf = weapon.Effect.ConvToIE(oppData)
		oppData.AddEffect(Inf)
	}}
	let EffectEditedData = [...currData.RunAllEffects(currData,oppData), ...oppData.RunAllEffects(oppData,currData)]
	console.log(EffectEditedData)
	let emb = new MessageEmbed()
	emb.setColor("RED")
	emb.setTitle(`${currData.Channel.guild.member(currData.Id)!.displayName}'s turn.`)

	// this is all just the embed

	emb.setDescription(`
	${gotHit ? 
		(`${currData.Channel.guild.member(currData.Id)!.displayName} Has hit ${oppData.Channel.guild.member(oppData.Id)!.displayName} for ${(weapon.Damage.modified + currData.DamageBoost)} (${gotcrit ?'with' : 'without'} Critical) damage.
		${oppData.Channel.guild.member(oppData.Id)!.displayName}'s Health is now at ${oppData.Health}`)
	: 
		`${currData.Channel.guild.member(currData.Id)!.displayName} Has missed with their attempt to hit ${oppData.Channel.guild.member(oppData.Id)!.displayName}`}
	${'-'.repeat(7)}Calculations${'-'.repeat(7)}
	
	Damage : ${weapon.Damage.base} 
	${weapon.Damage.base !== weapon.Damage.modified ? `+ ${weapon.Damage.modified - weapon.Damage.base} (Modifcations)` : 'No damage modifications'}
	${currData.DamageBoost > 0 ? `+ ${currData.DamageBoost} ( ${currData.GetBoostLog().map(v=> `+${v.by} : ${v.name}`).join(', ')} )` : 'No damage boosts.'}
	
	Health :
	${currData.Channel.guild.member(currData.Id)!.displayName} : ${PreData.curr.Health}
	${oppData.Channel.guild.member(oppData.Id)!.displayName} : ${PreData.opp.Health}
	- ${Damage} (Damage)
	
	Effects:
		${currData.Channel.guild.member(currData.Id)!.displayName}:
		${EffectEditedData.filter(v=>v.Eff.inflicting.Id === currData.Id).map(v=>`${v.Edited} ${v.Eff.doing.Opr} ${v.Eff.doing.Value}`).join('\n\t')}
		${oppData.Channel.guild.member(oppData.Id)!.displayName}:
		${EffectEditedData.filter(v => v.Eff.inflicting.Id === oppData.Id).map(v => `${v.Edited} ${v.Eff.doing.Opr} ${v.Eff.doing.Value}`).join('\n\t')}
	`)
	// that is long

	emb.setImage(Cl.users.resolve(currData.Id)!.displayAvatarURL({dynamic:true,size:64}))
	currData.removeBoostDamage('Crit')
	await messg.edit(emb)
	currData.RoundPass(); oppData.RoundPass()
	return setTimeout(async () => {
		await main(oppData, currData, messg)
	}, 6e3);
}

const godWeapon = new Weapon({
	Cost:{
		Buy:999,
		Sell:999
	},
	Damage:74,
	Droppable:false,
	HitChance:100,
	Name:'yes',
	DropRate:0,
	Effect: new Effect({
		name:'god\'s burn',
		rounds:44,
		to:{'Opr':'-','Target':'Inflicted',ValueOf:'Health'},
		vPerRound:'55'
	})
})

module.exports = class test extends Command
{

	constructor(  )
	{

		super
		(
			{
				Name : 'fight',
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
		let embmess = await message.channel.send(emb).catch( () => message.channel.send( GetError('NO_EMBED_PERMS')) )

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
		let meminv      = new Inventory({Weapons : [new Weapon({
			Name:'stick',
			Damage:5,
			Droppable:false,
			HitChance : 98,
			Cost : {Buy :1, Sell : 1}}
		)] })

		let oppinv      = new Inventory({Weapons : [new Weapon({
			Name:'stick',
			Damage:5,
			Droppable:false,
			HitChance : 98,
			Effect : new Effect( { to : {Target:'Inflicted',ValueOf:"Health",Opr:'-'}, rounds:1,name:'Test',vPerRound:1 } ),
			Cost : {Buy :1, Sell : 1}}
		)] })

		if (IsIdOwner(message.member!.id)) {
			meminv.AddWeapons(godWeapon)
			meminv.SetEquipped(meminv.Weapons)
		} else if (IsIdOwner(opp.id)) {
			oppinv.AddWeapons(godWeapon)
			oppinv.SetEquipped(oppinv.Weapons)
		}


		let StarterData = new PlayerData( {id:message.member!.id, inv : meminv,health:100, channel : message.channel as TextChannel } )
		let OppData     = new PlayerData( {id:opp.id, inv : oppinv,health:100, channel : message.channel as TextChannel} )

		await main(StarterData,OppData,embmess)

		return {Worked : true}
	}

}