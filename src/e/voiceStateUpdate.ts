import { VoiceState } from "discord.js";

let VCs = ['750171183634448403']
let whitelist = ['290867320266424320']

module.exports = function run(oldState : VoiceState, newState : VoiceState) : void {

    if (VCs.includes(newState.channelID ?? '')) 
        if (whitelist.includes(newState.member?.id ?? '')) return;
        newState.kick()
            .catch(console.log)
}
