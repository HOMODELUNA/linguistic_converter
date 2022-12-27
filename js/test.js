"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pa_tenyomi_1 = require("./converters/pa-tenyomi");
const grimm_verner_1 = __importDefault(require("./converters/grimm_verner"));
const great_vowel_shift_1 = __importDefault(require("./converters/great_vowel_shift"));
const Dictionary_1 = require("./Dictionary");
const example_dict = '\n\
boku: # 这个词的内部标识\n\
  spelling: "仆"\n\
  pronunciation: boku\n\
  meaning: 我,男性,单数\n\
  etymo: default\n\
\n\
ikuikuikuiku:\n\
  spelling: 一个一个一个一个\n\
  pronunciation: ikuikuikuiku\n\
  meaning:\n\
    - 强调"一个"物体\n\
    - 拟声词,标识被撅了而非常痛苦\n\
  etymo : \n\
    duplicate: #它是由另一个词重复而来\n\
      from: iku #源词的 id\n\
pana:\n\
  spelling: "花"\n\
  meaning: "flower"\n\
  pronunciation: "pana"\n\
\n\
apugi:\n\
  spelling: "扇"\n\
  meaning: "扇子"\n\
  pronunciation: "afugi"\n\
';
const dict1 = Dictionary_1.Dictionary.from_yaml(example_dict);
console.log(dict1);
console.log("源字典是:");
console.log(dict1.to_yaml());
function test_one(name, converter) {
    const cvted_dict = converter(dict1);
    console.log(`经过 ${name} 的字典是:`);
    console.log(cvted_dict.to_yaml());
    console.log("");
}
test_one("ハ行转呼", (0, pa_tenyomi_1.pa_tenyomi)(1.0));
test_one("格林-维尔纳定律", (0, grimm_verner_1.default)(1.0));
test_one("元音大回环", (0, great_vowel_shift_1.default)(1.0));
test_one("元音大回环然后是ハ行转呼", (0, Dictionary_1.sequential)((0, great_vowel_shift_1.default)(1.0), (0, pa_tenyomi_1.pa_tenyomi)(1.0)));
test_one("元音大回环和格林-维尔纳定律各1/2", (0, Dictionary_1.select)((0, Dictionary_1.equally)((0, great_vowel_shift_1.default)(1.0), (0, grimm_verner_1.default)(1.0))));
