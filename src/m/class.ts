import {Client, GuildMember, Message, Permissions} from 'discord.js'

interface CommandArgTypes {
    member? : GuildMember,
    bool?   : Boolean,
    num?    : Number,
    str?    : String,

}

interface CommandData {
    Name   : string
    Desc   : string
    Alias? : string[]
    Perms? : Permissions
    Args?  : CommandArgument[]
    Guild  : boolean
    Owner  : boolean
    Hidden : boolean
}
interface CommandAData {
    Name        : string
    Type        : keyof CommandArgTypes
    Needed      : boolean
    Position    : number[]      |   string
    prefix?     : string
    Perms?      : Permissions   |   null
    same?       : boolean
}

interface WeaponData {

    Name        : string
    Damage      : number
    Droppable   : boolean
    DropRate?   : number
    HitChance : number

}

interface InventoryData {
    Equipped?   : [Weapon,Weapon,Weapon],
    Weapons     : Weapon[]
}

export class Weapon {

    public Damage       : {base : number, modified : number}
    public DropRate?    : number | undefined
    readonly Droppable  : boolean
    readonly Name       : string
    readonly HitChance  : number

    constructor(Data    : WeaponData) {

        this.Name       = Data.Name
        this.Damage     = {base : Data.Damage ,modified : Data.Damage}
        this.Droppable  = Data.Droppable
        this.DropRate   = Data.DropRate
        this.HitChance  = Data.HitChance

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



class CommandArgument {

    readonly Name       : string
    readonly Needed     : boolean
    readonly Perms?     : Permissions   |   null
    readonly prefix?    : string
    readonly Position   : number[]      |   string
    readonly Type       : keyof CommandArgTypes
    readonly same?      : boolean
    constructor (Data   : CommandAData) {

        this.Name       = Data.Name
        this.Needed     = Data.Needed
        this.Perms      = Data.Perms    ?? null
        this.prefix     = Data.prefix   ?? ''
        this.Type       = Data.Type as keyof CommandArgTypes
        this.Position   = Data.Position
        this.same       = Data.same
        
    }
}

class Command {
    readonly Name   : string
    readonly Desc   : string
    readonly Alias? : string[]              |   null
    readonly Perms? : Permissions           |   null
    readonly Args?  : CommandArgument[]     |   undefined
    readonly Guild  : boolean
    readonly Owner  : boolean
    readonly Hidden : boolean

    constructor(Data: CommandData) {
        this.Name   = Data.Name  
        this.Desc   = Data.Desc  
        this.Alias  = Data.Alias ?? null
        this.Perms  = Data.Perms ?? null
        this.Args   = Data.Args  ?? undefined
        this.Guild  = Data.Guild 
        this.Owner  = Data.Owner 
        this.Hidden = Data.Hidden
    }

    /**
     *
     * @param message The message object.
     * @param client The client object.
     * @param args The arguments for this command.
     *
    */
    public run = async (message : Message, client : Client, args?: {name : string, value : CommandArgTypes}[] ): Promise<{Worked : boolean, Error? : Error}> => {

        return {Worked : false, Error : new Error('There is no run function!')}
    }

    /**
     *
     * @param name The string of the argument you which to get.
     * @param args The arguments passed into the function.
     */

    protected GetArg = ( name : string , args : {name : string, value : CommandArgTypes}[]) : any => {
        if (!args) return
        let filt = args.filter(v => v.name === name)[0]
        if(!filt) return
        return filt.value;

    }

}
export {Command, CommandArgument, CommandArgTypes}