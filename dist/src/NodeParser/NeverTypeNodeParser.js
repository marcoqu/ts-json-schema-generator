"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const NeverType_1 = require("../Type/NeverType");
class NeverTypeNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.NeverKeyword;
    }
    createType(node, context) {
        return new NeverType_1.NeverType();
    }
}
exports.NeverTypeNodeParser = NeverTypeNodeParser;
//# sourceMappingURL=NeverTypeNodeParser.js.map