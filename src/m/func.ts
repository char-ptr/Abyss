import { Commands } from ".."
import { Command, CommandArgTypes } from "./class"
import { Guild, GuildMember, Message, User, Client } from "discord.js"
import { Owner } from "./config"

const GetCommandFromS = (v : string) : Command | false => {
    let c : Command | false = false
    for ( let c2 of Array.from( Commands.values() ) ) {
        c = c2.get(v)??false
        if (c) break;
        
    }
    return c??false
}

export const IsIdOwner = (s: string) : boolean => {

    if (typeof Owner === 'string') {

        if (Owner === s) return true

        return false

    }else if (Array.isArray(Owner)) {

        if ( Owner.includes(s) ) return true

        return false

    } else return false

}

export const OwnerToUserArray = async (client : Client) : Promise<User[]> => {

    if (typeof Owner === 'string') {

        let o = await client.users.fetch(Owner).catch( e => process.exit(66) )
        if (!o) process.exit(66)
        return [o]

    }else if (Array.isArray(Owner)) {

        let o : User[] | undefined = []

        for (let v of Owner) {

            o = [...o, await client.users.fetch(v).catch( e => process.exit(66) )]

        }

        if (!o || o.length === 0) process.exit(66)

        return o

    } else process.exit(66)

}

const GetMemberFromGuild = async (msg : Message, str : string) : Promise<GuildMember | null> => {

    if (!str) return null
    let guild = msg.guild!
    let could : GuildMember[] | [GuildMember] = []
    let ms = await guild.members.fetch()

    for (let v of ms) {
        if (v[1].displayName.toLowerCase().match(str.toLowerCase()))    {could = [...could, v[1]]; continue;}
        if (v[0] === str)                                               {could = [...could, v[1]]; continue;}
        if (v[1].user.username.toLowerCase().match(str.toLowerCase()))  {could = [...could, v[1]]; continue;}
    }
    if (!could) return null
    if (could.length <= 0) return null
    else if (could.length >= 2){

        await msg.channel.send(`Sorry for interupting the command, but i have multiple results for the string "${str}", could you prehaps tell me which one you ment out of these:\n${could.map( (v,i) => `${i+1}:${v.displayName}${v.nickname ? ` \`(${v.user.username})\`` : ''}` ).join('\n')} `)
        let coll =  await msg.channel.awaitMessages( m => m.member.id == msg.author.id && ! isNaN( +m.content ) && +m.content -1 in could, {max : 1, time: 30*1000})
        if (coll.size <= 0) return null
        let n = +coll.first()!.content-1
        let sel = could.filter( (v,i) => i == n )[0]

        return sel?? null
    }
    else return could[0]
}



const Convert = async <T>(s : string, wanted : keyof CommandArgTypes, m : Message) : Promise<CommandArgTypes|null> => {

    let ts : string[] = []

    let conv : CommandArgTypes | null = null

    switch (wanted) {
        case 'member' as keyof CommandArgTypes:
            
            conv = await GetMemberFromGuild(m,s) as CommandArgTypes

        break;
        case 'str' as keyof CommandArgTypes:

            conv = s as CommandArgTypes

        break;
        case 'num' as keyof CommandArgTypes:

            conv = isNaN(Number(s)) ? null : Number(s) as CommandArgTypes

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