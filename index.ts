
import * as Dict from "./Dictionary"
import { pa_tenyomi } from "./converters/pa-tenyomi"
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
' 
console.log("hello ts I'm index")

console.log("borrowed from module hello: ")

const d = Dict.Dictionary.from_yaml(example_dict)

console.log(d)

const d_2 = pa_tenyomi(1.0)(d)
console.log(d_2)

console.log(d_2.to_yaml())