"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const bot_1 = require("../bot");
/**
 *
 * @param v The string which you would like to try and find a command with.
 */
const GetCommandFromS = (v) => {
    var _a;
    let c = false;
    for (let c2 of Array.from(bot_1.Commands.values())) {
        c = (_a = c2.get(v)) !== null && _a !== void 0 ? _a : false;
        if (c)
            break;
    }
    return c !== null && c !== void 0 ? c : false;
};
exports.GetCommandFromS = GetCommandFromS;
/**
 *
 * @param s the "Snowfake" of the user which you wish to see is an owner.
 */
exports.IsIdOwner = (s) => {
    if (typeof config_1.Owner === 'string') {
        if (config_1.Owner === s)
            return true;
        return false;
    }
    else if (Array.isArray(config_1.Owner)) {
        if (config_1.Owner.includes(s))
            return true;
        return false;
    }
    else
        return false;
};
/**
 *
 * @param client The discord client.
 * @description Don't use this anymore, Cba to fix at the moment.
 */
exports.OwnerToUserArray = (client) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof config_1.Owner === 'string') {
        let uu = yield client.shard.broadcastEval(`this.users.fetch(${config_1.Owner})`);
        if (!uu)
            process.exit(66);
        else if (uu instanceof discord_js_1.User)
            return [uu];
        else
            process.exit(66);
    }
    else if (Array.isArray(config_1.Owner)) {
        let o = [];
        for (let v of config_1.Owner) {
            console.log(v, config_1.Owner);
            let uu = yield client.shard.broadcastEval(`console.log(${v.toString()});this.users.cache.get(${v.toString()}) ? this.users.cache.get(${v.toString()}) : this.users.fetch(${v.toString()}).catch(e => console.log("Unable to find the owners on the shard ", this.shard.id))`);
            if (!uu)
                continue;
            console.log(uu);
            if (uu instanceof discord_js_1.User) {
                o = [...o, uu];
            }
        }
        if (!o || o.length === 0)
            process.exit(66);
        return o;
    }
    else
        process.exit(66);
});
/**
 *
 * @param msg The message object which initiated the search. This can also be a guild if.
 * @param str The string which you would like to match a user with.
 */
const GetMemberFromGuild = (msg, str) => __awaiter(void 0, void 0, void 0, function* () {
    if (!str)
        return null;
    let MorG = msg instanceof discord_js_1.Message;
    let guild = MorG ? msg.guild : msg;
    let could = [];
    let ms = yield guild.members.fetch();
    for (let v of ms) {
        if (v[1].displayName.toLowerCase().match(str.toLowerCase())) {
            could = [...could, v[1]];
            continue;
        }
        if (v[0] === str) {
            could = [...could, v[1]];
            continue;
        }
        if (v[1].user.username.toLowerCase().match(str.toLowerCase())) {
            could = [...could, v[1]];
            continue;
        }
    }
    if (!could)
        return null;
    if (could.length <= 0)
        return null;
    else if (could.length >= 2) {
        if (msg instanceof discord_js_1.Guild)
            return could[0];
        yield msg.channel.send(`Sorry for interupting the command, but i have multiple results for the string "${str}", could you prehaps tell me which one you ment out of these:\n${could.map((v, i) => `${i + 1}:${v.displayName}${v.nickname ? ` \`(${v.user.username})\`` : ''}`).join('\n')} `);
        let coll = yield msg.channel.awaitMessages(m => m.member.id == msg.author.id && !isNaN(+m.content) && +m.content - 1 in could, { max: 1, time: 30 * 1000 });
        if (coll.size <= 0)
            return null;
        let n = +coll.first().content - 1;
        let sel = could.filter((v, i) => i == n)[0];
        return sel !== null && sel !== void 0 ? sel : null;
    }
    else
        return could[0];
});
function PartialConv(thing) {
    return __awaiter(this, void 0, void 0, function* () {
        if (thing.partial)
            return yield thing.fetch();
        return thing;
    });
}
exports.PartialConv = PartialConv;
/**
 *
 * @param s the string which you're converting
 * @param wanted The wanted type.
 * @param m Message object.
 */
const Convert = (s, wanted, m) => __awaiter(void 0, void 0, void 0, function* () {
    let ts = [];
    let conv = null;
    switch (wanted) {
        case 'member':
            conv = (yield GetMemberFromGuild(m, s));
            break;
        case 'str':
            conv = s;
            break;
        case 'num':
            conv = isNaN(Number(s)) ? null : Number(s);
            break;
        case 'bool':
            conv = (s === 'true');
            break;
        default:
            console.log('Unable to find that type.');
            return null;
    }
    return conv;
});
exports.Convert = Convert;
