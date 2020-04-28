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
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../m/config");
var func_1 = require("../m/func");
function handleArg(Args, Class, message) {
    return __awaiter(this, void 0, void 0, function () {
        var member, word, conv;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    member = message.member;
                    if (Class.Position === 'all')
                        word = Args.join(' ');
                    else {
                        word = Args.filter(function (v, i) { return i < Class.Position.length; }).join(' ');
                    }
                    if (!word)
                        return [2 /*return*/, [false, 'Unable to find any arguments.']];
                    if (word.split(' ').length < (Array.isArray(Class.Position) ? Class.Position.length : 0))
                        return [2 /*return*/, [false, "Expected argument '" + Class.Name + "' @ position : " + (word.split(' ').length + 1) + " [after command]"]];
                    if (Class.prefix)
                        if (!word.startsWith(Class.prefix))
                            return [2 /*return*/, [false, "Expected a prefix. What it should of looked like : " + Class.prefix + word]];
                    if (Class.Perms)
                        if (member.permissions.missing(Class.Perms, true))
                            return [2 /*return*/, [false, "You do not have the required perms to use this argument! Required perms : " + Class.Perms.toArray().join(' | ')]];
                    return [4 /*yield*/, func_1.Convert(word, Class.Type, message)];
                case 1:
                    conv = _a.sent();
                    if (!conv)
                        return [2 /*return*/, [false, "I was unable to convert \"" + word + "\" into typeof " + Class.Type + "."]];
                    return [2 /*return*/, [true, conv]];
            }
        });
    });
}
module.exports = function run(client, message) {
    return __awaiter(this, void 0, void 0, function () {
        var args, comm, cmd, _a, _b, _c, Hargs, _d, _e, i, out_1, e_1_1, out;
        var e_1, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    console.log('NEW MESSAGE!');
                    if (message.content.indexOf(config_1.Prefix) !== 0)
                        return [2 /*return*/];
                    if (message.author.bot)
                        return [2 /*return*/];
                    args = message.content.slice(config_1.Prefix.length).trim().split(/ +/g);
                    if (!args)
                        return [2 /*return*/];
                    comm = args.shift().toLowerCase();
                    cmd = func_1.GetCommandFromS(comm);
                    if (!cmd) {
                        message.channel.send('Unable to get that command!');
                        return [2 /*return*/];
                    }
                    if (!cmd.Owner) return [3 /*break*/, 2];
                    if (!!func_1.IsIdOwner(message.author.id)) return [3 /*break*/, 2];
                    _b = (_a = message.channel).send;
                    _c = "Sorry, but the command you tried to execute requires you to be an \"Owner\", Here's a list of them ` ";
                    return [4 /*yield*/, func_1.OwnerToUserArray(client)];
                case 1:
                    _b.apply(_a, [_c + (_g.sent()).map(function (v) { return v.tag; }).join(',') + " ` "]);
                    return [2 /*return*/];
                case 2:
                    Hargs = [];
                    if (!cmd.Args) return [3 /*break*/, 10];
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 8, 9, 10]);
                    _d = __values(cmd.Args), _e = _d.next();
                    _g.label = 4;
                case 4:
                    if (!!_e.done) return [3 /*break*/, 7];
                    i = _e.value;
                    return [4 /*yield*/, handleArg(args, i, message)];
                case 5:
                    out_1 = _g.sent();
                    if (out_1[0]) {
                        Hargs = __spread(Hargs, [{ name: i.Name, value: out_1[1] }]);
                    }
                    else if (i.Needed && !out_1[0]) {
                        message.channel.send(out_1[1]);
                        return [2 /*return*/, void (0)];
                    }
                    else if (!i.Needed && !out_1[0])
                        console.log(out_1);
                    _g.label = 6;
                case 6:
                    _e = _d.next();
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 10];
                case 8:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 10];
                case 9:
                    try {
                        if (_e && !_e.done && (_f = _d.return)) _f.call(_d);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 10: return [4 /*yield*/, cmd.run(message, client, Hargs)];
                case 11:
                    out = _g.sent();
                    if (!out.Worked && out.Error) {
                        message.channel.send(out.Error.message);
                    }
                    return [2 /*return*/];
            }
        });
    });
};
