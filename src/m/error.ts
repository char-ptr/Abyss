let Errors : object =
{
	"NO_EMBED_PERMS" : 'Could you please give me permissions to send "Embed links", as i won\'t be able to operate properly without it, thanks! '


}

export function GetError(err : string) : string | false {
	// @ts-ignore
	return Errors[err]?? false
}