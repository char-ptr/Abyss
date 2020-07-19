import {Command, CommandArgTypes, InflictedEffect, Operators, PlayerData} from "./class"
import {Client, Guild, GuildMember, Message, User} from "discord.js"
import {Owner} from "./config"
import {Commands} from "../bot"

/**
 * 
 * @param v The string which you would like to try and find a command with.
 */
const GetCommandFromS = (v : string) : Command | false => {
    let c : Command | false = false
    for ( let c2 of Array.from( Commands.values() ) ) {
        let cr = c2.get(v)
        if (cr) c = cr[0];
        if (c) break;
        
    }
    return c??false
}

/**
 * 
 * @param s the "Snowfake" of the user which you wish to see is an owner.
 */
export const IsIdOwner = (s: string) : boolean => {

    if (typeof Owner === 'string') {

        if (Owner === s) return true

        return false

    }else if (Array.isArray(Owner)) {

        if ( Owner.includes(s) ) return true

        return false

    } else return false

}

export function RunEffect(effect: InflictedEffect,Curr :PlayerData,Opp:PlayerData) : undefined | {Edited : keyof PlayerData, To:any,As:PlayerData,Eff:InflictedEffect} {
    console.log((`Running effect!\nInflicter : ${Curr.Id}\nInflicted:${Opp.Id}\nTarget:${effect.doing.Target}`))
    switch (effect.doing.Target) {

        case "Inflicted":
            if (typeof Curr[effect.doing.ValueOf] === 'function') {
                (Curr[effect.doing.ValueOf] as Function)(effect.doing.Value)
            }
            else {

                // @ts-ignore
                Curr[effect.doing.ValueOf] = ChooseOperator(effect.doing.Opr,Curr[effect.doing.ValueOf],effect.doing.Value)

            }
            return {Edited: `${[effect.doing.ValueOf].toString()}` as keyof PlayerData, To:Curr[effect.doing.ValueOf],As:Curr,Eff:effect}
        break;
        case "Inflicter":
            if (typeof Opp[effect.doing.ValueOf] === 'function') {
                (Opp[effect.doing.ValueOf] as Function)(effect.doing.Value)
            }
            else {

                // @ts-ignore
                Opp[effect.doing.ValueOf] = ChooseOperator(effect.doing.Opr,Opp[effect.doing.ValueOf],effect.doing.Value)

            }
            return {Edited: effect.doing.ValueOf as keyof PlayerData, To:Opp[effect.doing.ValueOf],As:Opp,Eff:effect}
        break;
    }
    return

}
export function ChooseOperator(opr : keyof Operators, v1:any,v2:any) {
    switch (opr) {
        case "=":
            return v2
        break;
        case "+":
            return v1+v2
        break;
        case "*":
            return v1*v2
        break;
        case "-":
            return v1-v2
        break;
        case "/":
            return v1/v2
        break;
        default:
            return v2
        break;
    }


}

/**
 * 
 * @param client The discord client.
 * @description Don't use this anymore, Cba to fix at the moment.
 */
export const OwnerToUserArray = async (client : Client) : Promise<User[]> => {

    if (typeof Owner === 'string') {

        let uu = await client.shard!.broadcastEval(`this.users.fetch(${Owner})`)
        if (!uu) process.exit(66)
        else if (uu instanceof User) return [uu]
        else process.exit(66)

    }else if (Array.isArray(Owner)) {

        let o : User[] | undefined = []

        for (let v of Owner) {

            console.log(v,Owner)

            let uu = (await client.shard!.broadcastEval(`this.users.fetch(${Owner}).catch( () => {return false} )`)).filter(v => v instanceof User)

            if (!uu) continue

            console.log(uu)

            if( uu instanceof User) {

                o = [...o, uu]

            }

        }

        if (!o || o.length === 0) process.exit(66)

        return o

    } else process.exit(66)

}

/**
 *
 * @param milliseconds ms
 * @todo Fix, so that it actually waits the correct amount of time.
 * 
 */
export function sleep(milliseconds : number) {
    let start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

export function getrnd(min : number, max : number) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

/**
 * 
 * @param msg The message object which initiated the search. This can also be a guild if.
 * @param str The string which you would like to match a user with.
 */
const GetMemberFromGuild = async (msg : Message | Guild, str : string) : Promise<GuildMember | null> => {

    if (!str) return null
    let MorG = msg instanceof Message
    if (MorG && (msg as Message).mentions.members?.first() ) return (msg as Message).mentions.members!.first() ?? null
    if (MorG && str.toLowerCase() === 'me') return msg.member as GuildMember
    let guild = MorG ? (msg as Message).guild! : msg as Guild
    let could : GuildMember[] | [GuildMember] = []
    let ms = await guild.members.fetch()
    
    for (let v of ms) {
        if (v[1].displayName.toLowerCase().match(str.toLowerCase()))    {could = [...could, v[1]]; continue;}
        if (v[0] === str)                                               {could = [...could, v[1]]; continue;}
        if (v[1].id === str)                                            {could = [...could, v[1]]; break;}
        if (v[1].user.username.toLowerCase().match(str.toLowerCase()))  {could = [...could, v[1]]; }
    }
    if (!could) return null
    if (could.length <= 0) return null
    else if (could.length >= 2){

        if (msg instanceof Guild) return could[0]

        await msg.channel.send(`Sorry for interrupting the command, but i have multiple results for the string "${str}", could you perhaps tell me which one you meant out of these:\n${could.map( (v,i) => `${i+1}:${v.displayName}${v.nickname ? ` \`(${v.user.username})\`` : ''}` ).join('\n')} `)
        let coll =  await msg.channel.awaitMessages( m => m.member.id == msg.author.id && ! isNaN( +m.content ) && +m.content -1 in could, {max : 1, time: 30*1000})
        if (coll.size <= 0) return null
        let n = +coll.first()!.content-1
        let sel = could.filter( (v,i) => i == n )[0]

        return sel?? null
    }
    else return could[0]
}


export async function PartialConv <t>(thing : any) : Promise<t> {
    
    if (thing.partial) return await thing.fetch()

    return thing

}

/**
 * 
 * @param s the string which you're converting
 * @param wanted The wanted type.
 * @param m Message object.
 */
const Convert = async <T>(s : string, wanted : keyof CommandArgTypes, m : Message) : Promise<CommandArgTypes|null> => {

    let ts : string[] = []

    console.log(s,wanted)

    let conv : CommandArgTypes | null = null

    switch (wanted) {
        case 'member' as keyof CommandArgTypes:
            
            conv = await GetMemberFromGuild(m,s) as CommandArgTypes

        break;
        case 'str' as keyof CommandArgTypes:

            conv = s as CommandArgTypes

        break;
        case 'num' as keyof CommandArgTypes:

            conv = isNaN(Number(s)) ? null : parseInt(s) as CommandArgTypes

        break;
        case 'bool' as keyof CommandArgTypes:

            conv = (s === 'true') as CommandArgTypes

        break;
        default:
            console.log('Unable to find that type.')
            return null
    }



    return conv

}

export {GetCommandFromS, Convert}