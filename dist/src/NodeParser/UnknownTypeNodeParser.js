"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const UnknownType_1 = require("../Type/UnknownType");
class UnknownTypeNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.UnknownKeyword;
    }
    createType(node, context) {
        return new UnknownType_1.UnknownType();
    }
}
exports.UnknownTypeNodeParser = UnknownTypeNodeParser;
//# sourceMappingURL=UnknownTypeNodeParser.js.map