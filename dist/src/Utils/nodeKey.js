"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringify = require("json-stable-stringify");
const util_1 = require("util");
function hash(a) {
    if (util_1.isNumber(a)) {
        return a;
    }
    const str = util_1.isString(a) ? a : stringify(a);
    if (str.length < 20) {
        return str;
    }
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        h = (h << 5) - h + char;
        h = h & h;
    }
    if (h < 0) {
        return -h;
    }
    return h;
}
exports.hash = hash;
function getKey(node, context) {
    const ids = [];
    while (node) {
        const file = node.getSourceFile().fileName.substr(process.cwd().length + 1);
        ids.push(hash(file), node.pos, node.end);
        node = node.parent;
    }
    const id = ids.join("-");
    const argumentIds = context.getArguments().map(arg => arg.getId());
    return argumentIds.length ? `${id}<${argumentIds.join(",")}>` : id;
}
exports.getKey = getKey;
//# sourceMappingURL=nodeKey.js.map