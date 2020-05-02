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
class CommandArgument {
    constructor(Data) {
        var _a, _b;
        this.Name = Data.Name;
        this.Needed = Data.Needed;
        this.Perms = (_a = Data.Perms) !== null && _a !== void 0 ? _a : null;
        this.prefix = (_b = Data.prefix) !== null && _b !== void 0 ? _b : '';
        this.Type = Data.Type;
        this.Position = Data.Position;
    }
}
exports.CommandArgument = CommandArgument;
class Command {
    constructor(Data) {
        var _a, _b, _c;
        /**
         *
         * @param name The string of the argument you which to get.
         * @param args The arguments passed into the function.
         */
        this.GetArg = (name, args) => {
            if (!args)
                return;
            let filt = args.filter(v => v.name === name)[0];
            if (!filt)
                return;
            return filt.value;
        };
        /**
         *
         * @param message The message object.
         * @param client The client object.
         * @param args The arguments for this command.
         *
        */
        this.run = (message, client, args) => __awaiter(this, void 0, void 0, function* () {
            return { Worked: false, Error: new Error('There is no run function!') };
        });
        this.Name = Data.Name;
        this.Desc = Data.Desc;
        this.Alias = (_a = Data.Alias) !== null && _a !== void 0 ? _a : null;
        this.Perms = (_b = Data.Perms) !== null && _b !== void 0 ? _b : null;
        this.Args = (_c = Data.Args) !== null && _c !== void 0 ? _c : undefined;
        this.Guild = Data.Guild;
        this.Owner = Data.Owner;
        this.Hidden = Data.Hidden;
    }
}
exports.Command = Command;
