"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var e_1, _a, e_2, _b, e_3, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var discord_js_1 = require("discord.js");
var fs_1 = require("fs");
dotenv_1.config({ path: './.env' });
var Commands = new Map();
exports.Commands = Commands;
var CFolders = fs_1.readdirSync(__dirname + "\\c");
var EFiles = fs_1.readdirSync(__dirname + "\\e");
var client = new discord_js_1.Client();
client.login(process.env.DISCORD_TOKEN);
try {
    for (var EFiles_1 = __values(EFiles), EFiles_1_1 = EFiles_1.next(); !EFiles_1_1.done; EFiles_1_1 = EFiles_1.next()) {
        var v = EFiles_1_1.value;
        if (!v.endsWith('.js')) {
            console.error('NONE JS file in EVENT directory');
            continue;
        }
        var pull = require(__dirname + "\\e\\" + v);
        if (!pull) {
            console.error("Command '" + v + "' DOES NOT have a run function!");
            continue;
        }
        var s = v.slice(0, -3);
        if (typeof s != 'string')
            break;
        client.on(s, pull.bind(null, client));
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (EFiles_1_1 && !EFiles_1_1.done && (_a = EFiles_1.return)) _a.call(EFiles_1);
    }
    finally { if (e_1) throw e_1.error; }
}
try {
    for (var CFolders_1 = __values(CFolders), CFolders_1_1 = CFolders_1.next(); !CFolders_1_1.done; CFolders_1_1 = CFolders_1.next()) {
        var v = CFolders_1_1.value;
        Commands.set(v, new Map());
        var stat = fs_1.statSync(__dirname + "\\c\\" + v);
        if (!stat.isDirectory()) {
            console.error("found a NONE DIRECTORY in COMMANDS FOLDER. '" + v + "' ");
            continue;
        }
        var CFiles = fs_1.readdirSync(__dirname + "\\c\\" + v);
        try {
            for (var CFiles_1 = (e_3 = void 0, __values(CFiles)), CFiles_1_1 = CFiles_1.next(); !CFiles_1_1.done; CFiles_1_1 = CFiles_1.next()) {
                var v2 = CFiles_1_1.value;
                var dir = __dirname + "\\c\\" + v + "\\" + v2;
                if (!v2.endsWith('.js')) {
                    console.error("NONE JS file in COMMAND directory / " + v2);
                    continue;
                }
                var pull = require(dir);
                var pulled = new pull();
                Commands.get(v).set(v2.slice(0, -3), pulled);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (CFiles_1_1 && !CFiles_1_1.done && (_c = CFiles_1.return)) _c.call(CFiles_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
}
catch (e_2_1) { e_2 = { error: e_2_1 }; }
finally {
    try {
        if (CFolders_1_1 && !CFolders_1_1.done && (_b = CFolders_1.return)) _b.call(CFolders_1);
    }
    finally { if (e_2) throw e_2.error; }
}
