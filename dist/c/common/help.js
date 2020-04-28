"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var class_1 = require("../../m/class");
var discord_js_1 = require("discord.js");
var __1 = require("../..");
var func_1 = require("../../m/func");
var config_1 = require("../../m/config");
module.exports = /** @class */ (function (_super) {
    __extends(test, _super);
    function test() {
        var _this = _super.call(this, {
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
        }) || this;
        _this.run = function (message, client, args) { return __awaiter(_this, void 0, void 0, function () {
            var cmd, c, emb, emb, _loop_1, _a, _b, folder;
            var e_1, _c;
            var _d, _e;
            return __generator(this, function (_f) {
                cmd = this.GetArg('Command', args);
                console.log(cmd);
                if (cmd) {
                    c = func_1.GetCommandFromS(cmd);
                    if (!c)
                        return [2 /*return*/, { Worked: false, Error: new Error('Unable to find that command') }];
                    emb = new discord_js_1.MessageEmbed();
                    emb.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
                    emb.setDescription("Information about the command \"" + c.Name + "\"");
                    emb.setTitle(c.Name);
                    emb.setTimestamp(new Date());
                    emb.setColor('#b0ffa8');
                    emb.addField('Usage', "```css\n" + config_1.Prefix + c.Name + " " + (c.Args ? c.Args.map(function (v) { return v.Needed ? "<" + v.Name + (v.Position.length > 1 ? "-" + (v.Position.length - 1) + " : " + v.Type : '') + ">" : "[" + v.Name + (v.Position.length > 1 ? "-" + (v.Position.length - 1) : '') + " : " + v.Type + "]"; }) : '') + "```\n`<> = needed, [] = not needed, -number = length of arg(words)`");
                    emb.addField('Permissions', (_e = (_d = c.Perms) === null || _d === void 0 ? void 0 : _d.toArray().join(', ')) !== null && _e !== void 0 ? _e : 'No permissions');
                    emb.addField('Guild only', c.Guild ? 'Yes' : 'No');
                    message.channel.send(emb);
                }
                else {
                    emb = new discord_js_1.MessageEmbed();
                    emb.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
                    emb.setDescription('All commands.');
                    emb.setTitle('Commands');
                    emb.setTimestamp(new Date());
                    emb.setColor('#ffa978');
                    emb.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
                    _loop_1 = function (folder) {
                        var arr = __spread(folder[1].keys()).filter(function (v) { var _a; return !((_a = folder[1].get(v)) === null || _a === void 0 ? void 0 : _a.Hidden); }).map(function (v) { return '• ' + v; });
                        console.log(arr.length);
                        emb.addField(folder[0], arr.length <= 0 ? 'No commands!' : arr.join('\n'), emb.fields.length + 1 % 3 != 0 ? true : false);
                    };
                    try {
                        for (_a = __values(__1.Commands.entries()), _b = _a.next(); !_b.done; _b = _a.next()) {
                            folder = _b.value;
                            _loop_1(folder);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    message.channel.send(emb);
                }
                return [2 /*return*/, { Worked: true }];
            });
        }); };
        return _this;
    }
    return test;
}(class_1.Command));
