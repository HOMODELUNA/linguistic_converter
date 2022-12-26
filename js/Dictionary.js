"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequential = exports.each_word = exports.pronunciation_only = exports.Dictionary = void 0;
const yaml_1 = __importDefault(require("yaml"));
class Dictionary extends Map {
    static from_yaml(source) {
        const parsed = yaml_1.default.parse(source);
        var words_iterator = function* () {
            for (const id in parsed) {
                const val = parsed[id];
                const pair = [id, val];
                yield pair;
            }
        };
        return new Dictionary(words_iterator());
    }
    to_yaml() {
        const yielder = function* (d) {
            for (const id of d.keys()) {
                const v = d.get(id);
                if (v == undefined) {
                    throw "怎么可能,难道字典在这个函数执行中就被改了?";
                }
                const entries = {
                    spelling: v.spelling,
                    pronunciation: v.pronunciation,
                    meaning: v.meaning,
                    etymo: v.etymo,
                };
                const pair = [id, entries];
                yield pair;
            }
        };
        const hash = new Map(yielder(this));
        return yaml_1.default.stringify(hash);
    }
    /**
     * 	把自己送进转换器中,组成一个新字典
     */
    into(converter) {
        return converter(this);
    }
}
exports.Dictionary = Dictionary;
/**
 * 一个制作词演化器的辅助函数
 * 每个单词只变化发音
 */
function pronunciation_only(ipa_converter) {
    return function (word) {
        //SB语言连深拷贝都没有
        var res = JSON.parse(JSON.stringify(word));
        //修改新词的发音
        res.pronunciation = ipa_converter(word.pronunciation);
        return res;
    };
}
exports.pronunciation_only = pronunciation_only;
/**
 * 一个制作演化器的辅助函数
 * 每个单词做同样的变化,由此组成一个字典
 */
function each_word(word_converter) {
    let converted_words = function* (source) {
        for (const [key, value] of source.entries()) {
            const pair = [key, word_converter(value)];
            yield pair;
        }
    };
    return (source) => new Dictionary(converted_words(source));
}
exports.each_word = each_word;
/**
 * 把多个转换器首尾连接起来
 * @param converters 从前到后写出converter
 */
function sequential(...converters) {
    return (source) => converters.reduce((former, converter) => converter(former), source);
}
exports.sequential = sequential;
