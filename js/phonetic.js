"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_vowel = void 0;
const ALL_VOWELS = "iyɨʉɯuɪʏʊeøɘɵɤoəɛœɜɞʌɔæɐaäɑɒ";
/**
 * 判断一个字符是不是元音字符,仅限字符长度为1的情况
 * @param char
 */
function is_vowel(char) {
    return char.length == 1 && ALL_VOWELS.includes(char);
}
exports.is_vowel = is_vowel;
