import {ShardingManager} from "discord.js";
import {config} from "dotenv"

config( { path: './.env' } )


const m = new ShardingManager('./dist/bot.js' , {token : process.env.DISCORD_TOKEN})
m.spawn();
m.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
