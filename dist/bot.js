"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
dotenv_1.config({ path: './.env' });
const Commands = new Map();
exports.Commands = Commands;
const CFolders = fs_1.readdirSync(`${__dirname}\\c`);
const EFiles = fs_1.readdirSync(`${__dirname}\\e`);
const client = new discord_js_1.Client({ partials: ['MESSAGE'] });
client.login(process.env.DISCORD_TOKEN);
for (let v of EFiles) {
    if (!v.endsWith('.js')) {
        console.error('NONE JS file in EVENT directory');
        continue;
    }
    let pull = require(`${__dirname}\\e\\${v}`);
    if (!pull) {
        console.error(`Command '${v}' DOES NOT have a run function!`);
        continue;
    }
    let s = v.slice(0, -3);
    if (typeof s != 'string')
        break;
    client.on(s, pull.bind(null, client));
}
//Commands
for (let v of CFolders) {
    Commands.set(v, new Map());
    let stat = fs_1.statSync(`${__dirname}\\c\\${v}`);
    if (!stat.isDirectory()) {
        console.error(`found a NONE DIRECTORY in COMMANDS FOLDER. '${v}' `);
        continue;
    }
    let CFiles = fs_1.readdirSync(`${__dirname}\\c\\${v}`);
    for (let v2 of CFiles) {
        let dir = `${__dirname}\\c\\${v}\\${v2}`;
        if (!v2.endsWith('.js')) {
            console.error(`NONE JS file in COMMAND directory / ${v2}`);
            continue;
        }
        let pull = require(dir);
        let pulled = new pull();
        Commands.get(v).set(v2.slice(0, -3), pulled);
    }
}
