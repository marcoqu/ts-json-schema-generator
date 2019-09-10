"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringify = require("json-stable-stringify");
function intersectionOfArrays(a, b) {
    const output = [];
    const inA = new Set(a.map((item) => stringify(item)));
    for (const value of b) {
        if (inA.has(stringify(value))) {
            output.push(value);
        }
    }
    return output;
}
exports.intersectionOfArrays = intersectionOfArrays;
//# sourceMappingURL=intersectionOfArrays.js.map