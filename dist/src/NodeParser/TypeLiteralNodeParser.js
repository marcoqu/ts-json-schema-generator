"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const ObjectType_1 = require("../Type/ObjectType");
const isHidden_1 = require("../Utils/isHidden");
const nodeKey_1 = require("../Utils/nodeKey");
class TypeLiteralNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.TypeLiteral;
    }
    createType(node, context, reference) {
        const id = this.getTypeId(node, context);
        if (reference) {
            reference.setId(id);
            reference.setName(id);
        }
        return new ObjectType_1.ObjectType(id, [], this.getProperties(node, context), this.getAdditionalProperties(node, context));
    }
    getProperties(node, context) {
        return node.members.filter(ts.isPropertySignature).reduce((result, propertyNode) => {
            const propertySymbol = propertyNode.symbol;
            if (isHidden_1.isHidden(propertySymbol)) {
                return result;
            }
            const objectProperty = new ObjectType_1.ObjectProperty(propertySymbol.getName(), this.childNodeParser.createType(propertyNode.type, context), !propertyNode.questionToken);
            result.push(objectProperty);
            return result;
        }, []);
    }
    getAdditionalProperties(node, context) {
        const indexSignature = node.members.find(ts.isIndexSignatureDeclaration);
        if (!indexSignature) {
            return false;
        }
        return this.childNodeParser.createType(indexSignature.type, context);
    }
    getTypeId(node, context) {
        return `structure-${nodeKey_1.getKey(node, context)}`;
    }
}
exports.TypeLiteralNodeParser = TypeLiteralNodeParser;
//# sourceMappingURL=TypeLiteralNodeParser.js.map