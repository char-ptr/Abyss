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
const clean = (text) => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
};
module.exports = class test extends class_1.Command {
    constructor() {
        super({
            Name: 'exe',
            Desc: 'Execute javascript.',
            Guild: false,
            Owner: true,
            Hidden: true,
            Args: [new class_1.CommandArgument({
                    Name: 'code',
                    Needed: true,
                    Type: "str",
                    Perms: null,
                    Position: 'all'
                })]
        });
        this.run = (message, client, args) => __awaiter(this, void 0, void 0, function* () {
            try {
                const code = this.GetArg('code', args);
                let evaled = yield eval(code);
                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);
                message.channel.send(clean(evaled), { code: "ts", split: true });
            }
            catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`ts\n${clean(err)}\n\`\`\``);
            }
            return { Worked: true };
        });
    }
};
