import {ShardingManager} from "discord.js";
import {config} from "dotenv"
import {createConnection} from "mysql";

config( { path: './.env' } )

export const con = createConnection({
    user:'root',
    host: "localhost",
    password:process.env.MYSQLPASSWORD
})
con.on('connect',()=>console.log('mysql server running'))

if (require.main == module) {

    const m = new ShardingManager('./dist/bot.js' , {token : process.env.DISCORD_TOKEN})
    m.spawn();

    m.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
    m.on('shardCreate', function (shard) { console.log(`Launched shard ${shard.id}`)} );
}