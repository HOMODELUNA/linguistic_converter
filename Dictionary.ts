import YAML from "yaml"
import{ tuple ,equally,num_select} from "./util";

export {equally}

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
	static from_yaml(source : string):Dictionary{
		const parsed = YAML.parse(source)
		var words_iterator = function*(){
			for(const id in parsed){
				const val = parsed[id] as Word
				yield tuple(id,val)
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
				yield tuple(id,entries)
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
export function pronunciation_only(
	ipa_converter :(source:string)=>string 
): WordConverter{
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
	//构造一个迭代器,这个迭代器接受源字典,每次yield的是字典的原值(id)和转换过的value
	let converted_words = function* (source : Dictionary){
		for (const [key,value] of source.entries()) {
			yield tuple(key,word_converter(value))
		}
	}
	// 输出的是一个函数,这个函数
	// 输入一个字典,输出的是这个字典每个词转换过的结果
	return (source: Dictionary)=> new Dictionary(converted_words(source));
}
/**
 * 把多个转换器首尾连接起来
 * @param converters 从前到后写出converter
 */
export function sequential(...converters : DictConverter[]): DictConverter{
	return (source : Dictionary)=> converters.reduce(
		(former, converter) => converter(former),
		source
	)
}


/**
 * 根据输入的若干表达式和权重,产生的词转换器,将每个词按不同的随机性归由各个转换器得来
 * @param converter_weight 
 * @returns 
 */
export function word_select(...converter_weight : [WordConverter,number][]):WordConverter{
	return (word:Word) => num_select(Math.random(),converter_weight)(word)
}
/**
 * 根据输入的若干表达式和权重,产生的字典转换器,将每个词按不同的随机性归由各个转换器得来
 * ### 性能注意
 * 
 * 这个函数会对每一个converter都会产生新的字典.这可能会产生比较大的开销.
 * 如果你有源转换器的word版本,可以用 `each_word(word_select(word_converter_amd_weights))`做同样的事,降低性能开销
 * @param converter_weight 
 * @returns 
 */
export function select(converter_weight : [DictConverter,number][]):DictConverter{
	const weights = converter_weight.map(([cvt,w])=>w)
	const total_weight = weights.reduce((prev,cur)=>prev+cur)
	if(total_weight != 1) {
		throw new Error(`各转换器的权重和必须为1,而不是 ${total_weight}`);
	}
	return (dict:Dictionary)=>{
		const results = converter_weight.map(([cvt,w])=>{
			const pair : [Dictionary,number] = [cvt(dict),w]
			return pair
		})
		function* selected_words(){
			for(const [id,value] of dict.entries()){
				const new_value = num_select(Math.random(),results).get(id)
				if(new_value ==undefined) { 
					throw new Error(`some dict dont have key: ${id}`)
				}
				yield tuple(id,new_value)
			}
		}
		return new Dictionary(selected_words())
	}
}


