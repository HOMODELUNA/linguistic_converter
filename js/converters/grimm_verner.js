"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.w_grimm_verner = exports.no_accent = void 0;
const Dictionary_1 = require("../Dictionary");
const TRANSFORMS = [
    ["bʱ", "b", "p", "φ", "f"],
    ["dʱ", "d", "t", "θ"],
    ["gʱ", "g", "k", "x", "h"]
];
function find_next(c) {
    const row = TRANSFORMS.find(arr => arr.includes(c));
    if (row == undefined) {
        return null;
    }
    const index = row.findIndex(x => x == c);
    if (index == row.length - 1) {
        return { next: row[1] };
    }
    return row[index + 1];
}
function ipa_grimm_verner(ipa, ratio, accent_pos) {
    const replaced_mono_consonants = Array.from(ipa).reduce((prev, current, index) => {
        const next = find_next(current);
        if (next == null || Math.random() > ratio) {
            return prev + current;
        }
        else if (typeof next === "string") {
            return prev + next;
        }
        else if (!accent_pos(ipa, index - 1)) {
            //这就是Verner定律的表现,如果前面的不是元音,那就可以继续往前轮
            return prev + next.next;
        }
        return prev + current;
    }, "");
    if (ipa.match("[bdg]ʱ") && Math.random() <= ratio) {
        return ipa.replace("bʱ", "b")
            .replace("dʱ", "d")
            .replace("gʱ", "g");
    }
    return replaced_mono_consonants;
}
/**
 * 如果你的语言没有重音,那么可以用这个函数填补grimm_verner函数的空位
 * @returns 总是为false
 */
const no_accent = (ipa, pos) => false;
exports.no_accent = no_accent;
/**
 * 格林-维尔纳定律的词版本
 * @param ratio
 * @param accent_pos
 * @returns
 */
function w_grimm_verner(ratio = 1.0, accent_pos = exports.no_accent) {
    const ratioed = (ipa) => ipa_grimm_verner(ipa, ratio, accent_pos);
    return (0, Dictionary_1.pronunciation_only)(ratioed);
}
exports.w_grimm_verner = w_grimm_verner;
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
function grimm_verner(ratio = 1.0, accent_pos = exports.no_accent) {
    return (0, Dictionary_1.each_word)(w_grimm_verner(ratio, accent_pos));
}
exports.default = grimm_verner;
