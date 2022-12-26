import { DictConverter, each_word, pronunciation_only } from "../Dictionary"
const TRANSFORMS = [
	["bʱ", "b", "p", "φ", "f"],
	["dʱ", "d", "t", "θ"],
	["gʱ", "g", "k", "x", "h"]
]
interface atEnd {
	next: string
}
function find_next(c: string): string | atEnd | null {
	const row = TRANSFORMS.find(arr => arr.includes(c))
	if (row == undefined) { return null; }
	const index = row.findIndex(x => x == c)
	if (index == row.length - 1) {
		return { next: row[1] }
	}
	return row[index + 1]
}

function str_grimm_verner(ipa: string, ratio: number, accent_pos: AccentPredicate): string {
	var replaced_mono_consonants = Array.from(ipa).reduce((prev, current, index) => {
		const next = find_next(current)
		if (next == null || Math.random() > ratio) {
			return prev + current
		}
		else if (typeof next === "string") {
			return prev + next
		}
		else if (!accent_pos(ipa, index - 1)) {
			//这就是Verner定律的表现,如果前面的不是元音,那就可以继续往前轮
			return prev + next.next
		}
		return prev + current
	})
	if (ipa.match("[bdg]ʱ") && Math.random() <= ratio) {
		return ipa.replace("bʱ", "b")
			.replace("dʱ", "d")
			.replace("gʱ", "g")
	}
	return replaced_mono_consonants
}
/**
 * 不一定每个语言中都有重读,有重读的语言中,规律也不尽相同,
 * 所以判断重读的规律就让用户自己去做吧
 * - 如果字符串`ipa`中的`pos`位置是一个重读的元音,那么返回`true`
 * - - 如果你的元音用两个或以上字符表示,那么重读元音的每个部分都应当判断为`true`
 * - 否则返回`false`  
 */
type AccentPredicate = (ipa: string, pos: number) => boolean
/**
 * 如果你的语言没有重音,那么可以用这个函数填补grimm_verner函数的空位
 * @returns 总是为false
 */
export const no_accent = (ipa: string, pos: number) => false
/**
 * 格林定律解释的是印欧语系中的语音演变问题，
 * 主要指从原始印欧语（PIE）向日耳曼语族的变化，
 * 辅音演变遵循下述的规律：
 * 
 * 送气浊爆破音>不送气浊爆破音>清爆破音>清擦音.即:
 * - bʱ>b>p>φ/f
 * - dʱ>d>t>θ
 * - gʱ>g>k>x/h
 * 
 * 格林定律非常地规整，但其实并不完善，存在一些例外。
 * 于是另外还有一个补充的定律叫作维尔纳定律（Verner's law），
 * 进一步解释了——如果上述三组辅音前面的元音是非重读的，
 * 则`fθx`又会进一步变成`bdg`
 * 
 * 由于一个单词的重音规则是不确定的,这个函数需要造语者来提供判断重音的方法
 * @param ratio 符合标准的词汇有多少概率发生变化,默认是1.0
 * @param {AccentPredicate} accent_pos  判断重读的方法.
 * - 如果字符串`ipa`中的`pos`位置是一个重读的元音,那么返回`true`
 * - - 如果你的元音用两个或以上字符表示,那么重读元音的每个部分都应当判断为`true`
 * - 否则返回`false`  
 * @returns {DictConverter}
 */
function grimm_verner(
	ratio: number = 1.0,
	accent_pos: AccentPredicate = no_accent
): DictConverter {
	const ratioed = (ipa: string) => str_grimm_verner(ipa, ratio, accent_pos)
	return each_word(pronunciation_only(ratioed))
}

export default grimm_verner



