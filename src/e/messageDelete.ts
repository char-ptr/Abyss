import { Client, Message, User, GuildAuditLogsEntry, MessageEmbed } from "discord.js"
import { PartialConv } from "../m/func"

module.exports = async function run(client :Client, message : Message) : Promise<void> {

/*     if(message.guild) {

        let s = ( await message.guild.fetchAuditLogs({type:'MESSAGE_DELETE',limit:5}) ).entries.filter(search => {

            if(!search) return false
            if ( new Date().getTime() - (13 * 1000) > search.createdAt.getTime()) return false

            if (search.target instanceof User) {
                console.log(search.target)
                console.log(search.target.username , 'vs', message.author.username)
                if (search.target.id !== message.author.id) {
                    console.log(search.target.id,message.author.id);
                    return false
                } 
            }

            try{

                let id = Object.values(search.extra!)[0].id

                console.log(id, 'vs', message.channel.id)

                if (id === message.channel.id ) return true

            }catch (e) {return false}            

            return false
        }).last()

        if (s) {

        let emb = new MessageEmbed()
        emb.setAuthor(message.author.username,await message.author.displayAvatarURL())
        emb.setTitle(`${s.executor.tag} Probably deleted ${message.author.tag}'s message.`)


        message.channel.send(emb)

        }else {

            message.channel.send(`It would seem that ${message.author.tag} decided to delete their own message.`)

        }

    } */

}
