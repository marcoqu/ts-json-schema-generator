"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const FunctionType_1 = require("./../Type/FunctionType");
class FunctionNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.FunctionType;
    }
    createType() {
        return new FunctionType_1.FunctionType();
    }
}
exports.FunctionNodeParser = FunctionNodeParser;
//# sourceMappingURL=FunctionNodeParser.js.map