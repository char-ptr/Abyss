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
var __1 = require("..");
var config_1 = require("./config");
var GetCommandFromS = function (v) {
    var e_1, _a;
    var _b;
    var c = false;
    try {
        for (var _c = __values(Array.from(__1.Commands.values())), _d = _c.next(); !_d.done; _d = _c.next()) {
            var c2 = _d.value;
            c = (_b = c2.get(v)) !== null && _b !== void 0 ? _b : false;
            if (c)
                break;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return c !== null && c !== void 0 ? c : false;
};
exports.GetCommandFromS = GetCommandFromS;
exports.IsIdOwner = function (s) {
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
exports.OwnerToUserArray = function (client) { return __awaiter(void 0, void 0, void 0, function () {
    var o, o, Owner_1, Owner_1_1, v, _a, e_2_1;
    var e_2, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(typeof config_1.Owner === 'string')) return [3 /*break*/, 2];
                return [4 /*yield*/, client.users.fetch(config_1.Owner).catch(function (e) { return process.exit(66); })];
            case 1:
                o = _c.sent();
                if (!o)
                    process.exit(66);
                return [2 /*return*/, [o]];
            case 2:
                if (!Array.isArray(config_1.Owner)) return [3 /*break*/, 11];
                o = [];
                _c.label = 3;
            case 3:
                _c.trys.push([3, 8, 9, 10]);
                Owner_1 = __values(config_1.Owner), Owner_1_1 = Owner_1.next();
                _c.label = 4;
            case 4:
                if (!!Owner_1_1.done) return [3 /*break*/, 7];
                v = Owner_1_1.value;
                _a = [o];
                return [4 /*yield*/, client.users.fetch(v).catch(function (e) { return process.exit(66); })];
            case 5:
                o = __spread.apply(void 0, _a.concat([[_c.sent()]]));
                _c.label = 6;
            case 6:
                Owner_1_1 = Owner_1.next();
                return [3 /*break*/, 4];
            case 7: return [3 /*break*/, 10];
            case 8:
                e_2_1 = _c.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 10];
            case 9:
                try {
                    if (Owner_1_1 && !Owner_1_1.done && (_b = Owner_1.return)) _b.call(Owner_1);
                }
                finally { if (e_2) throw e_2.error; }
                return [7 /*endfinally*/];
            case 10:
                if (!o || o.length === 0)
                    process.exit(66);
                return [2 /*return*/, o];
            case 11:
                process.exit(66);
                _c.label = 12;
            case 12: return [2 /*return*/];
        }
    });
}); };
var GetMemberFromGuild = function (msg, str) { return __awaiter(void 0, void 0, void 0, function () {
    var guild, could, ms, ms_1, ms_1_1, v, coll, n_1, sel;
    var e_3, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!str)
                    return [2 /*return*/, null];
                guild = msg.guild;
                could = [];
                return [4 /*yield*/, guild.members.fetch()];
            case 1:
                ms = _b.sent();
                try {
                    for (ms_1 = __values(ms), ms_1_1 = ms_1.next(); !ms_1_1.done; ms_1_1 = ms_1.next()) {
                        v = ms_1_1.value;
                        if (v[1].displayName.toLowerCase().match(str.toLowerCase())) {
                            could = __spread(could, [v[1]]);
                            continue;
                        }
                        if (v[0] === str) {
                            could = __spread(could, [v[1]]);
                            continue;
                        }
                        if (v[1].user.username.toLowerCase().match(str.toLowerCase())) {
                            could = __spread(could, [v[1]]);
                            continue;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (ms_1_1 && !ms_1_1.done && (_a = ms_1.return)) _a.call(ms_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                if (!could)
                    return [2 /*return*/, null];
                if (!(could.length <= 0)) return [3 /*break*/, 2];
                return [2 /*return*/, null];
            case 2:
                if (!(could.length >= 2)) return [3 /*break*/, 5];
                return [4 /*yield*/, msg.channel.send("Sorry for interupting the command, but i have multiple results for the string \"" + str + "\", could you prehaps tell me which one you ment out of these:\n" + could.map(function (v, i) { return i + 1 + ":" + v.displayName + (v.nickname ? " `(" + v.user.username + ")`" : ''); }).join('\n') + " ")];
            case 3:
                _b.sent();
                return [4 /*yield*/, msg.channel.awaitMessages(function (m) { return m.member.id == msg.author.id && !isNaN(+m.content) && +m.content - 1 in could; }, { max: 1, time: 30 * 1000 })];
            case 4:
                coll = _b.sent();
                if (coll.size <= 0)
                    return [2 /*return*/, null];
                n_1 = +coll.first().content - 1;
                sel = could.filter(function (v, i) { return i == n_1; })[0];
                return [2 /*return*/, sel !== null && sel !== void 0 ? sel : null];
            case 5: return [2 /*return*/, could[0]];
        }
    });
}); };
var Convert = function (s, wanted, m) { return __awaiter(void 0, void 0, void 0, function () {
    var ts, conv, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ts = [];
                conv = null;
                _a = wanted;
                switch (_a) {
                    case 'member': return [3 /*break*/, 1];
                    case 'str': return [3 /*break*/, 3];
                    case 'num': return [3 /*break*/, 4];
                    case 'bool': return [3 /*break*/, 5];
                }
                return [3 /*break*/, 6];
            case 1: return [4 /*yield*/, GetMemberFromGuild(m, s)];
            case 2:
                conv = (_b.sent());
                return [3 /*break*/, 7];
            case 3:
                conv = s;
                return [3 /*break*/, 7];
            case 4:
                conv = isNaN(Number(s)) ? null : Number(s);
                return [3 /*break*/, 7];
            case 5:
                conv = (s === 'true');
                return [3 /*break*/, 7];
            case 6:
                console.log('Unable to find that type.');
                return [2 /*return*/, null];
            case 7: return [2 /*return*/, conv];
        }
    });
}); };
exports.Convert = Convert;
