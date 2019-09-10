"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const ObjectType_1 = require("../Type/ObjectType");
const nodeKey_1 = require("../Utils/nodeKey");
class ObjectTypeNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.ObjectKeyword;
    }
    createType(node, context) {
        return new ObjectType_1.ObjectType(`object-${nodeKey_1.getKey(node, context)}`, [], [], true);
    }
}
exports.ObjectTypeNodeParser = ObjectTypeNodeParser;
//# sourceMappingURL=ObjectTypeNodeParser.js.map