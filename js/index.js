"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Dict = __importStar(require("./Dictionary"));
const pa_tenyomi_1 = require("./converters/pa-tenyomi");
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
console.log("hello ts I'm index");
console.log("borrowed from module hello: ");
const d = Dict.Dictionary.from_yaml(example_dict);
console.log(d);
const d_2 = (0, pa_tenyomi_1.pa_tenyomi)(1.0)(d);
console.log(d_2);
console.log(d_2.to_yaml());
