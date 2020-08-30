let Errors : object =
{
	"NO_EMBED_PERMS" : 'Could you please give me permissions to send "Embed links", as i won\'t be able to operate properly without it, thanks! ',
	"BAD_ARG" : 'The message which you sent has bad arguments. Help for this command is under this message.'

}

//@todo GetError is literally useless.
export function GetError(err : string) : string | false {
	// @ts-ignore
	return Errors[err]?? false
}