"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const AliasType_1 = require("../Type/AliasType");
const nodeKey_1 = require("../Utils/nodeKey");
class TypeAliasNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.TypeAliasDeclaration;
    }
    createType(node, context, reference) {
        if (node.typeParameters && node.typeParameters.length) {
            node.typeParameters.forEach(typeParam => {
                const nameSymbol = this.typeChecker.getSymbolAtLocation(typeParam.name);
                context.pushParameter(nameSymbol.name);
                if (typeParam.default) {
                    const type = this.childNodeParser.createType(typeParam.default, context);
                    context.setDefault(nameSymbol.name, type);
                }
            });
        }
        const id = this.getTypeId(node, context);
        if (reference) {
            reference.setId(id);
            reference.setName(id);
        }
        return new AliasType_1.AliasType(id, this.childNodeParser.createType(node.type, context));
    }
    getTypeId(node, context) {
        return `alias-${nodeKey_1.getKey(node, context)}`;
    }
}
exports.TypeAliasNodeParser = TypeAliasNodeParser;
//# sourceMappingURL=TypeAliasNodeParser.js.map