"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intersectionOfArrays_1 = require("./intersectionOfArrays");
function deepMerge(a, b, intersectArrays) {
    const typeA = typeof a;
    const typeB = typeof b;
    if (typeA === typeB && typeA === "object" && typeA !== null && a !== b) {
        const isArrayA = Array.isArray(a);
        const isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
            if (intersectArrays) {
                return intersectionOfArrays_1.intersectionOfArrays(a, b);
            }
            else {
                return b;
            }
        }
        else if ((isArrayA && !isArrayB) || (!isArrayA && isArrayB)) {
            return b;
        }
        else {
            const output = Object.assign({}, a);
            for (const key in output) {
                if (b.hasOwnProperty(key)) {
                    output[key] = deepMerge(a[key], b[key], intersectArrays);
                }
            }
            for (const key in b) {
                if (!a.hasOwnProperty(key)) {
                    output[key] = b[key];
                }
            }
            if ("$ref" in output && ("allOf" in output || "anyOf" in output)) {
                delete output.$ref;
            }
            return output;
        }
    }
    return b;
}
exports.deepMerge = deepMerge;
//# sourceMappingURL=deepMerge.js.map