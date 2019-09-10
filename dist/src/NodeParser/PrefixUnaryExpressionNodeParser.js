"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const LiteralType_1 = require("../Type/LiteralType");
class PrefixUnaryExpressionNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.PrefixUnaryExpression;
    }
    createType(node, context) {
        const operand = this.childNodeParser.createType(node.operand, context);
        if (operand instanceof LiteralType_1.LiteralType) {
            switch (node.operator) {
                case ts.SyntaxKind.PlusToken:
                    return new LiteralType_1.LiteralType(+operand.getValue());
                case ts.SyntaxKind.MinusToken:
                    return new LiteralType_1.LiteralType(-operand.getValue());
                case ts.SyntaxKind.TildeToken:
                    return new LiteralType_1.LiteralType(~operand.getValue());
                case ts.SyntaxKind.ExclamationToken:
                    return new LiteralType_1.LiteralType(!operand.getValue());
                default:
                    throw new Error(`Unsupported prefix unary operator: ${node.operator}`);
            }
        }
        else {
            throw new Error(`Expected operand to be "LiteralType" but is "${operand.constructor.name}"`);
        }
    }
}
exports.PrefixUnaryExpressionNodeParser = PrefixUnaryExpressionNodeParser;
//# sourceMappingURL=PrefixUnaryExpressionNodeParser.js.map