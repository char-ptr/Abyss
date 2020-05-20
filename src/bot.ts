import {config} from "dotenv"
import { Client, ClientEvents } from "discord.js"
import { readdirSync, statSync } from "fs"
import { Command } from "./m/class"
config( { path: './.env' } )

const Commands : Map<string,Map<string,Command>> = new Map()
const CFolders = readdirSync(`${__dirname}/c`)
const EFiles = readdirSync(`${__dirname}/e`)
const client = new Client({partials : ['MESSAGE']})

if (process.env.test) client.login(process.env.TEST_DISCORD_TOKEN)
else client.login(process.env.DISCORD_TOKEN)

for (let v of EFiles) {

    if (!v.endsWith('.js')) {console.error('NONE JS file in EVENT directory'); continue}
    let pull : Function = require(`${__dirname}/e/${v}`)
    if (!pull) {console.error(`Command '${v}' DOES NOT have a run function!`); continue}
    let s = v.slice(0,-3) as keyof ClientEvents
    if (typeof s != 'string') break
    client.on( s , pull.bind(null,client))
}

//Commands
for (let v of CFolders) {
    Commands.set(v, new Map())
    let stat = statSync(`${__dirname}/c/${v}`)
    if (!stat.isDirectory()) {console.error(`found a NONE DIRECTORY in COMMANDS FOLDER. '${v}' `); continue}
    let CFiles = readdirSync(`${__dirname}/c/${v}`)
    for (let v2 of CFiles) {

        let dir = `${__dirname}/c/${v}/${v2}`
        if (!v2.endsWith('.js')) {console.error(`NONE JS file in COMMAND directory / ${v2}`); continue}
        let pull = require(dir)
        let pulled : Command = new pull()
        
        Commands.get(v)!.set(pulled.Name,pulled)
        if (pulled.Alias) {
            for (let v2 of pulled.Alias) {

                Commands.get(v)!.set(v2,pulled)

            }
        }

    } 

}

export {Commands} 