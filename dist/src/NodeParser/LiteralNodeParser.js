"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
class LiteralNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.LiteralType;
    }
    createType(node, context) {
        return this.childNodeParser.createType(node.literal, context);
    }
}
exports.LiteralNodeParser = LiteralNodeParser;
//# sourceMappingURL=LiteralNodeParser.js.map