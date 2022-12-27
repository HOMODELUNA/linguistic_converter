"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.num_select = exports.equally = exports.tuple = void 0;
/**
 * SB语言有元组,但是没有元组字面量
 * 我还得自己造一个
 * @param args
 * @returns
 */
const tuple = (...args) => args;
exports.tuple = tuple;
function equally(...arr) {
    const len = arr.length, average = 1 / len;
    return arr.map((x) => (0, exports.tuple)(x, average));
}
exports.equally = equally;
function num_select(num, arr) {
    var x = num;
    for (const [v, p] of arr) {
        if (x >= 0 && x < p) {
            return v;
        }
        x -= p;
    }
    throw new Error(`it won't happen unless num > 1, found ${num}`);
}
exports.num_select = num_select;
