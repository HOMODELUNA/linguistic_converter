"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pa_tenyomi = void 0;
const Dictionary_1 = require("../Dictionary");
//字符串的音变
function ipa_pa_tenyomi(ipa, ratio = 1.0) {
    if (ipa.match("fɸp") && Math.random() <= ratio) {
        return ipa.replace("f", "h")
            .replace("ɸ", "f")
            .replace("p", "ɸ");
    }
    return ipa;
}
/**
 * pa 行转呼
*/
function pa_tenyomi(ratio) {
    const ratioed = (ipa) => ipa_pa_tenyomi(ipa, ratio);
    return (0, Dictionary_1.each_word)((0, Dictionary_1.pronunciation_only)(ratioed));
}
exports.pa_tenyomi = pa_tenyomi;
