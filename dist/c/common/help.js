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
const class_1 = require("../../m/class");
const discord_js_1 = require("discord.js");
const func_1 = require("../../m/func");
const config_1 = require("../../m/config");
const bot_1 = require("../../bot");
module.exports = class test extends class_1.Command {
    constructor() {
        super({
            Name: 'help',
            Desc: 'Gets information on a command, or lists commands.',
            Guild: false,
            Owner: false,
            Hidden: false,
            Args: [new class_1.CommandArgument({
                    Name: 'Command',
                    Needed: false,
                    Type: "str",
                    Perms: null,
                    Position: [0]
                })]
        });
        this.run = (message, client, args) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let cmd = this.GetArg('Command', args);
            console.log(cmd);
            if (cmd) {
                let c = func_1.GetCommandFromS(cmd);
                if (!c)
                    return { Worked: false, Error: new Error('Unable to find that command') };
                let emb = new discord_js_1.MessageEmbed();
                emb.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
                emb.setDescription(`Information about the command "${c.Name}"`);
                emb.setTitle(c.Name);
                emb.setTimestamp(new Date());
                emb.setColor('#b0ffa8');
                emb.addField('Usage', `\`\`\`css\n${config_1.Prefix}${c.Name} ${c.Args ? c.Args.map(v => v.Needed ? `<${v.Name}${v.Position.length > 1 ? `-${typeof v.Position === 'string' ? 'all' : v.Position.length - 1} : ${v.Type}` : ''}>` : `[${v.Name}${v.Position.length > 1 ? `-${typeof v.Position === 'string' ? 'all' : v.Position.length - 1} : ${v.Type}` : ''} : ${v.Type}]`) : ''}\`\`\`\n\`<> = needed, [] = not needed, -number = length of arg(words), : type = arg type.\``);
                emb.addField('Permissions', (_b = (_a = c.Perms) === null || _a === void 0 ? void 0 : _a.toArray().join(', ')) !== null && _b !== void 0 ? _b : 'No permissions');
                emb.addField('Guild only', c.Guild ? 'Yes' : 'No');
                message.channel.send(emb);
            }
            else {
                let emb = new discord_js_1.MessageEmbed();
                emb.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
                emb.setDescription('All commands.');
                emb.setTitle('Commands');
                emb.setTimestamp(new Date());
                emb.setColor('#ffa978');
                emb.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
                for (let folder of bot_1.Commands.entries()) {
                    let arr = [...folder[1].keys()].filter(v => { var _a; return !((_a = folder[1].get(v)) === null || _a === void 0 ? void 0 : _a.Hidden); }).map(v => '• ' + v);
                    console.log(arr.length);
                    emb.addField(folder[0], arr.length <= 0 ? 'No commands!' : arr.join('\n'), emb.fields.length + 1 % 3 != 0 ? true : false);
                }
                message.channel.send(emb);
            }
            return { Worked: true };
        });
    }
};
