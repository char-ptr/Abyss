import {Client, GuildMember, Message, Permissions, TextChannel} from 'discord.js'
import {RunEffect} from "./func";


// interfaces


interface CommandArgTypes { // the different types of command argument types.
    member? : GuildMember,
    bool?   : Boolean,
    num?    : Number,
    str?    : String,

}
export interface Operators { // different operators which can be used

    '+':string,
    '-':string,
    '*':string,
    '/':string,
    '=':string


}


interface CommandData { // data about what can be passed into a command
    Name   : string
    Desc   : string
    Alias? : string[]
    Perms? : Permissions
    Args?  : CommandArgument[]
    Guild  : boolean
    Owner  : boolean
    Hidden : boolean
    Nsfw?  : boolean
}
interface CommandAData { // data about what can be passed into a command argument
    Name        : string
    AltNames?   : string[]
    Type        : keyof CommandArgTypes
    ExampleVal? : string
    Needed      : boolean
    prefix?     : string
    Perms?      : Permissions   |   null
}

interface WeaponEffectTarget { // scuffed shit

    Inflicted    : PlayerData
    Inflicter     : PlayerData


}
interface WeaponData {// data for what information weapons hold.

    Name        : string
    Damage      : number
    Droppable   : boolean
    DropRate?   : number
    Effect?     : Effect
    HitChance   : number
    Cost        : {
        Sell:number,
        Buy:number
    }

}

interface InventoryData { // how inventory is saved.
    Equipped?   : [Weapon,Weapon,Weapon],
    Weapons     : Weapon[]
}

interface EffectData { // what data an effect can have
    name:string,
    rounds:number,
    to:
        {
            Target : keyof WeaponEffectTarget,
            ValueOf : keyof PlayerData,
            Opr:keyof Operators
        },
    vPerRound:any
}
interface InflictedEffectData { // data for inflicted effects :weirdchamp: why not use effect data? have no fucking clue.
    inflicting : PlayerData,
    doing :
        {
            Target : keyof WeaponEffectTarget,
            ValueOf : keyof PlayerData,
            Value:any,
            Opr:keyof Operators
        },
    roundsRemaining : number
}

export class PlayerData {

    readonly Id         : string
    readonly Channel    : TextChannel
    public Inv          : Inventory
    public Health       : number
    public CritCh       : number    = 83
    public DamageBoost  : number    = 0
    public skipped      : number    = 0
    private DamBooLog   : {name : string, by : number}[] = []
    private Effects     : InflictedEffect[] = []
    constructor( {id,inv,health,channel} : {id:string,inv:Inventory,health:number,channel:TextChannel} ) {
        this.Id     = id
        this.Inv    = inv
        this.Health = health
        this.Channel= channel
    }
    public GetEffects = (on? : PlayerData) => {return on ? this.Effects.filter(v=>v.inflicting === on) : this.Effects}
    public RunAllEffects = (curr:PlayerData,opp:PlayerData) => {
        let did : {Edited : keyof PlayerData, To:any,As:PlayerData,Eff:InflictedEffect}[] = []
        for (let effect of this.Effects) {
            let out = effect.run(curr.Id === this.Id ? curr : opp,opp.Id !== this.Id ? opp : curr)
            if(out) did = [...did,out]
        }
        return did
    }
    public AddEffect = (eff :InflictedEffect) => {this.Effects=[...this.Effects,eff]}
    public RemoveEffect = (eff:InflictedEffect) => {this.Effects.splice(this.Effects.indexOf(eff),1)}
    public RoundPass = () => {


        for (let effect of this.Effects) {
            effect.RemoveRound()
            if (effect.roundsRemaining <=0) this.Effects.splice(this.Effects.indexOf(effect),1)
        }
    }

    public addBoostDamage = (why:string,by:number) => {

        this.DamageBoost += by
        this.DamBooLog = [...this.DamBooLog,{name:why,by:by}]

    }
    public removeBoostDamage = (why:string) => {

        let dat = this.DamBooLog.filter(v=>v.name===why)[0]
        if(!dat) {console.error('Unable to find that modifier'); return}
        this.DamageBoost -= dat.by
        this.DamBooLog.splice(this.DamBooLog.indexOf(dat),1)

    }
    public GetBoostLog = () => {return this.DamBooLog}

}

export class InflictedEffect {

    readonly inflicting : PlayerData
    readonly doing : { Target : keyof WeaponEffectTarget, ValueOf : keyof PlayerData, Value:any,Opr : keyof Operators}
    public roundsRemaining : number
    constructor(Data : InflictedEffectData) {
        this.inflicting = Data.inflicting
        this.doing = Data.doing
        this.roundsRemaining = Data.roundsRemaining
    }
    public run = (curr:PlayerData,opp:PlayerData) => {
        return (RunEffect(this, curr,opp) )
    }
    public RemoveRound = () => {return this.roundsRemaining--}

}
export class Effect {
    readonly name:string
    public rounds:number
    readonly to:{ Target : keyof WeaponEffectTarget, ValueOf : keyof PlayerData, Opr:keyof Operators}
    readonly vPerRound:any
    constructor(data : EffectData) {
        this.name = data.name
        this.rounds = data.rounds
        this.to = data.to
        this.vPerRound = data.vPerRound
    }
    public ConvToIE = (Inflicted : PlayerData) => {
        return new InflictedEffect({roundsRemaining:this.rounds,doing:{Target:this.to.Target,Value:this.vPerRound,ValueOf:this.to.ValueOf, Opr:this.to.Opr},inflicting:Inflicted})
    }
}

export class Weapon {

    public Damage       : {base : number, modified : number}
    public DropRate?    : number | undefined
    public Effect?      : Effect | undefined
    public Cost         : {Sell:number,Buy:number}
    readonly Droppable  : boolean
    readonly Name       : string
    readonly HitChance  : number


    constructor(Data    : WeaponData) {

        this.Name       = Data.Name
        this.Damage     = {base : Data.Damage ,modified : Data.Damage}
        this.Droppable  = Data.Droppable
        this.DropRate   = Data.DropRate
        this.HitChance  = Data.HitChance
        this.Effect     = Data.Effect
        this.Cost       = {Sell : Data.Cost.Sell ?? (Math.floor((30/Data.Cost.Buy)*100))??1, Buy : Data.Cost.Buy?? (Math.floor( (130/Data.Cost.Sell)*100 ))??1 }

    }
}

export class Inventory {

    public Equipped     : Weapon[]    | undefined
    public Weapons      : Weapon[]

    constructor(Data    : InventoryData) {

        this.Weapons    = Data.Weapons
        this.Equipped   = Data.Equipped ?? Data.Weapons.slice(0,2)

    }
    public AddWeapons = (wep : Weapon) => {
        if (this.Weapons.indexOf(wep) >=0) return console.error('Attempted to add weapon, but that weapon is already inside the weapons array..')
        if (this.Weapons.length > 3) return console.error('Attempted to add weapon, but the max has been reached.')
        this.Weapons.push(wep)

    }
    public RemoveWeapons = (wep : Weapon) => {
        if (this.Weapons.indexOf(wep) <0) return console.error('Attempted to remove weapon, but that weapon isn\'t inside the weapons array..')
        this.Weapons.splice(this.Weapons.indexOf(wep),1)

    }
    public SetEquipped = (weps : Weapon[]) => {
        weps.slice(0,2)
        this.Equipped = weps

    }
}

interface ServerSettingsData {
    BlockedCommands : string[],
    MuteRole        : string,

    
}

class ServerSettings {

}

interface UserSettingsData {
    Inventory : Inventory
    Id : string
    
}

class UserSettings {

}


class CommandArgument {

    readonly Name       : string
    readonly AltNames?  : string[]
    readonly Needed     : boolean
    readonly Perms?     : Permissions   |   null
    readonly prefix?    : string
    readonly ExampleVal?: string
    readonly Type       : keyof CommandArgTypes


    protected Checks : Map<string,{f:(client:Client,message:Message,args: any)=> Promise<boolean>,e:boolean}>
    constructor (Data   : CommandAData) {

        this.Name       = Data.Name
        this.AltNames   = Data.AltNames
        this.Needed     = Data.Needed
        this.ExampleVal = Data.ExampleVal
        this.Perms      = Data.Perms    ?? null
        this.prefix     = Data.prefix   ?? ''
        this.Type       = Data.Type as keyof CommandArgTypes

        this.Checks = new Map<string, {f: (client: Client, message: Message, args: any) => Promise<boolean>; e: boolean}>()
    }
    public RunAllChecks(Client:Client,Message:Message, Argument : any) {
        return Array.from(this.Checks).map(value => value[1].f(Client,Message,Argument))
    }
}
type checkf = (client: Client, message: Message, args: {[p: string]: any}) => Promise<boolean>

class Command {
    readonly Name   : string
    readonly Desc   : string
    readonly Alias? : string[]              |   null
    readonly Perms? : Permissions           |   null
    readonly Args?  : CommandArgument[]     |   undefined
    readonly Nsfw?  : boolean               |   undefined
    readonly Guild  : boolean
    readonly Owner  : boolean
    readonly Hidden : boolean

    protected Checks : Map<string,{f:checkf,e:boolean,s:boolean}>
    public GetArgument(Str : string) {
        return this.Args?.filter(v=>v.Name?.toLowerCase() == Str?.toLowerCase() || v.AltNames?.map(v=>v.toLowerCase()).includes(Str?.toLowerCase()))[0]
    }
    constructor(Data: CommandData) {
        this.Nsfw   = Data.Nsfw
        this.Name   = Data.Name
        this.Desc   = Data.Desc
        this.Alias  = Data.Alias ?? null
        this.Perms  = Data.Perms ?? null
        this.Args   = Data.Args  ?? undefined
        this.Guild  = Data.Guild
        this.Owner  = Data.Owner
        this.Hidden = Data.Hidden

        this.Checks = new Map<string, {f: checkf, e: boolean,s:boolean}>()
    }

    public RunAllChecks(Client:Client,Message:Message, Arguments : {[x:string]:any}) {
        return Array.from(this.Checks).map(value => ({val:value[1].f(Client,Message,Arguments),name:value[0],strict:value[1].s}))
    }
    protected AddCheck(name:string,Data:{f:checkf,e:boolean,s?:boolean}) {
        this.Checks.set(name, {...Data, s: Data.s ?? true})
    }

    /**
     *
     * @param message The message object.
     * @param client The client object.
     * @param args The arguments for this command.
     *
     */

    public run = async (message : Message, client : Client, args: {[x:string]:any} ): Promise<{Worked : false, Error? : Error | string} | {Worked : true}> => {

        return {Worked : false, Error : new Error('There is no run function!')}
    }

    /**
     *
     * @param name The string of the argument you which to get.
     * @param args The arguments passed into the function.
     */

    public GetArg = ( name : string , args : {[x:string]:any}) => {

        return args[name]

    }

}
interface RatelimitClientType {
    LimitPerUser? : number;
    TimeBeforeRequests? : number;
}
export class RatelimitClient {
    private data : {[x:string]:{Dates:number[], Seen:boolean}} = {}
    public TimeBeforeRequests : number = 7e3
    public LimitPerUser : number = 5;
    constructor(Data? : RatelimitClientType) {
        this.LimitPerUser = Data?.LimitPerUser ?? this.LimitPerUser
        this.TimeBeforeRequests = Data?.TimeBeforeRequests ?? this.TimeBeforeRequests
    }
    public isRateLimited(user:string) : [boolean,number] {
        if (!this.data[user]) return [false,0];
        let TimeUntil = Math.abs(Date.now()-this.data[user].Dates[0]-this.TimeBeforeRequests)
        return [this.data[user]?.Dates.length >= this.LimitPerUser,TimeUntil]
    }
    public seen(user:string) {
        if (!this.data[user]) return;
        this.data[user].Seen = true;
    }
    public hasSeen(user:string) {
        if (!this.data[user]) return;
        return this.data[user].Seen
    }
    public add(user :string) {
        if (!this.data[user]) this.data[user] = {Dates:[],Seen:false}
        this.data[user].Dates=[
            ...this.data[user].Dates,
            Date.now()
        ]
        setTimeout(v=>{
            this.data[user].Dates.shift()
            if (this.data[user].Dates.length == 0) delete this.data[user]
        },this.TimeBeforeRequests)

    }
}

export {Command, CommandArgument, CommandArgTypes}