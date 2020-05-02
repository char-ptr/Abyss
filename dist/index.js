"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
dotenv_1.config({ path: './.env' });
const m = new discord_js_1.ShardingManager('./dist/bot.js', { token: process.env.DISCORD_TOKEN });
m.spawn();
m.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
