import { DictConverter, WordConverter, each_word, pronunciation_only } from "../Dictionary"
import { is_vowel } from "../phonetic"
import { tuple } from "../util"
//https://chaucer.fas.harvard.edu/pages/great-vowel-shift
//https://zhuanlan.zhihu.com/p/343845790
const VOWELMAP = new Map<string,string>([
	["a","æ"],
	["æ","ɛ"],
	["ɛ","e"],
	["e","i"],
	["i","əi"],
	["i:","əi"],
	["əi","ai"],
	["ai","æi"],
	["æi","ei"],
	["æ:","e:"],
	["e:","i:"],
	["a:","e:"],
	["eu","iu"],
	//后面的是一组
	["ɔ","o"],
	["o","u"],
	["u","əu"],
	["əu","əu"],
	["o:","u:"],
	["u:","au"],
	["au","ɔu"],
	["ɔu","o:"],
])
function best_in_map<K,V>(pred : (k:K,v:V) => Boolean,better_cmp:(p1:[K,V],p2:[K,V])=>boolean,m : Map<K,V>):[K,V] | null{
	var res = null
	for(const p of m.entries()){
		if (pred(p[0],p[1])){
			if (res ==null){res = p}
			else if (better_cmp(p,res)){res = p}
		}
	}
	return res
}
function* each_with_index(str:string){
	const len = str.length
	for(var i = 0;i< len;++i){
		yield tuple(str.charAt(i),i)
	}
}
function ipa_gvs(ipa:string,ratio : number):string{
	const key_is_longer = (p1:[string,string],p2:[string,string])=>{
		return p1[0].length >p2[0].length
	}

	const is_head =(index:number) => (vowel:string,next:string)=>{
		return ipa.startsWith(vowel,index)

	}
	var times_continue = 0;
	var res = ""
	for(const [c,index] of each_with_index(ipa)){
		if (times_continue > 0){
			--times_continue
			continue
		}
		//不涉及辅音
		if ( ! is_vowel(c)){
			res += c;continue
		}
		const find_res = best_in_map(is_head(index),key_is_longer,VOWELMAP)
		if(find_res == null){res += c;continue}
		//如果因为机缘巧合被忽略了
		if(Math.random() > ratio){
			const original = find_res[0]
			res += original
			times_continue = original.length -1
			continue
		}
		const substitued = find_res[1]
		res += substitued
		times_continue = find_res[0].length -1
	}

	return res
}

export function w_great_vowel_shift(ratio:number) : WordConverter {
	const ratioed = (ipa : string) => ipa_gvs(ipa,ratio) 
	return pronunciation_only(ratioed)
}

/**
 *  元音大挪移是英语发生的重大音变现象.具体时间已不可考,
 *  但是人们自16世纪就已经发现了它.
 * 	它大概遵循两条路线:
 * 	1. a->æ->ɛ->e->i->əi->ai
 *  2. ɔ->o->u->əu->au  
 * 
 *  实际情况会更加复杂.
 * @param ratio 符合标准的词汇有多少概率发生变化,默认是1.0
 * @returns {DictConverter}
 */
export default function great_vowel_shift(ratio:number) {
	return each_word(w_great_vowel_shift(ratio))
}