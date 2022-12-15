import YAML from "yaml"
export interface Word {
	id : string;
	spelling : string;
	pronunciation : string;
	meaning : string;
	etymo : any;
}
interface PrintWord{
	spelling : string;
	pronunciation : string;
	meaning : string;
	etymo : any;
}

export class Dictionary extends Map<string,Word>{
	static from_yaml(source : string){
		const parsed = YAML.parse(source)
		var words_iterator = function*(){
			for(const id in parsed){
				const val = parsed[id] as Word
				const pair:[string,Word] = [id,val]
				yield pair
			}
		}
		return new Dictionary(words_iterator())
	}
	to_yaml():string{
		const yielder = function*(d:Dictionary){
			for(const id of d.keys()){
				const v = d.get(id)
				if(v == undefined){
					throw "怎么可能,难道字典在这个函数执行中就被改了?"
				}
				const entries : PrintWord = {
					spelling: v.spelling,
					pronunciation : v.pronunciation,
					meaning : v.meaning,
					etymo : v.etymo,
				}
				const pair:[string,PrintWord] = [id,entries]
				yield pair
			}
		}
		const hash = new Map<string,PrintWord>(yielder(this))
		return YAML.stringify(hash)
	}
	/**
	 * 	把自己送进转换器中,组成一个新字典
	 */
	into(converter : (source:Dictionary) => Dictionary){
		return converter(this)
	}
}


export type WordConverter = (source:Word) => Word;
export type DictConverter = (source:Dictionary) => Dictionary;


/**
 * 一个制作词演化器的辅助函数  
 * 每个单词只变化发音
 */
export function pronunciation_only(ipa_converter :(source:string)=>string ): WordConverter{
	return function(word : Word){
		//SB语言连深拷贝都没有
		var res = JSON.parse(JSON.stringify(word));
		//修改新词的发音
		res.pronunciation = ipa_converter(word.pronunciation);
		return res
	}
}
/**
 * 一个制作演化器的辅助函数
 * 每个单词做同样的变化,由此组成一个字典
 */
export function each_word(word_converter:WordConverter):DictConverter{
	let converted_words = function* (source : Dictionary){
		for (const [key,value] of source.entries()) {
			const pair : [string,Word]=[key,word_converter(value)] 
			yield pair
		}
	}
	return (source: Dictionary)=> new Dictionary(converted_words(source));
}
/**
 * 把多个转换器首尾连接起来
 * @param converters 从前到后写出converter
 */
export function Sequential(...converters : DictConverter[]): DictConverter{
	return (source : Dictionary)=> converters.reduce(
		(former, converter) => converter(former),
		source
	)
}


