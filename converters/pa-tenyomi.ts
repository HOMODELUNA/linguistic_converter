import {each_word,pronunciation_only}  from "../Dictionary"


//字符串的音变
function ipa_pa_tenyomi(ipa : string,ratio = 1.0) : string{
	if(ipa.match("fɸp") && Math.random() <= ratio){
		return ipa.replace("f","h")
			.replace("ɸ","f")
			.replace("p","ɸ")
	}
	return ipa
}
	
/**
 * pa 行转呼
*/
export function pa_tenyomi(ratio:number){
	const ratioed = (ipa : string) => ipa_pa_tenyomi(ipa,ratio) 
	return each_word(pronunciation_only(ratioed))
} 