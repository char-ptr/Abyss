let Errors : object =
{
	"NO_EMBED_PERMS" : 'Could you please give me permissions to send "Embed links", as i won\'t be able to operate properly without it, thanks! ',
	"BAD_ARG" : 'The message which you sent has bad arguments, if you want to get help with the command you\'re using you can use the "help" command with the "-cmd" argument, with the command name.'

}

export function GetError(err : string) : string | false {
	// @ts-ignore
	return Errors[err]?? false
}