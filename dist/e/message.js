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
const config_1 = require("../m/config");
const func_1 = require("../m/func");
/**
 *
 * @param Args The arguments (words after command) within the message.
 * @param Class The class of the argument.
 * @param message The message object which initiated the event.
 */
function handleArg(Args, Class, message) {
    return __awaiter(this, void 0, void 0, function* () {
        let member = message.member;
        let word;
        if (Class.Position === 'all')
            word = Args.join(' ');
        else
            word = Args.filter((v, i) => i < Class.Position.length).join(' ');
        if (!word)
            return [false, 'Unable to find any arguments.'];
        if (word.split(' ').length < (Array.isArray(Class.Position) ? Class.Position.length : 0))
            return [false, `Expected argument '${Class.Name}' @ position : ${word.split(' ').length + 1} [after command]`];
        if (Class.prefix)
            if (!word.startsWith(Class.prefix))
                return [false, `Expected a prefix. What it should of looked like : ${Class.prefix}${word}`];
            else
                word = word.slice(Class.prefix.length);
        console.log(word);
        if (Class.same && word != Class.Name)
            return [false, `Expected the argument to be exactly the same as the argument name...`];
        if (Class.Perms)
            if (member.permissions.missing(Class.Perms, true))
                return [false, `You do not have the required perms to use this argument! Required perms : ${Class.Perms.toArray().join(' | ')}`];
        let conv = yield func_1.Convert(word, Class.Type, message);
        if (!conv)
            return [false, `I was unable to convert "${word}" into typeof ${Class.Type}.`];
        return [true, conv];
    });
}
module.exports = function run(client, message) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('NEW MESSAGE!');
        if (message.content.indexOf(config_1.Prefix) !== 0)
            return;
        if (message.author.bot)
            return;
        const args = message.content.slice(config_1.Prefix.length).trim().split(/ +/g);
        if (!args)
            return;
        const comm = args.shift().toLowerCase();
        let cmd = func_1.GetCommandFromS(comm);
        if (!cmd) {
            message.channel.send('Unable to get that command!');
            return;
        }
        if (cmd.Owner)
            if (!func_1.IsIdOwner(message.author.id)) {
                message.channel.send(`Sorry, but the command you tried to execute requires you to be an "Owner"`);
                return;
            }
        let Hargs = [];
        if (cmd.Args) {
            for (let i of cmd.Args) {
                let out = yield handleArg(args, i, message);
                if (out[0]) {
                    Hargs = [...Hargs, { name: i.Name, value: out[1] }];
                }
                else if (i.Needed && !out[0]) {
                    message.channel.send(out[1]);
                    return void (0);
                }
                else if (!i.Needed && !out[0])
                    console.log(out);
            }
        }
        let out = yield cmd.run(message, client, Hargs);
        if (!out.Worked && out.Error) {
            message.channel.send(out.Error.message);
        }
    });
};
