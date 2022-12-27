
const ALL_VOWELS = "iyɨʉɯuɪʏʊeøɘɵɤoəɛœɜɞʌɔæɐaäɑɒ"
/**
 * 判断一个字符是不是元音字符,仅限字符长度为1的情况
 * @param char 
 */
export function is_vowel(char:string):boolean {
	return char.length == 1 && ALL_VOWELS.includes(char)
}