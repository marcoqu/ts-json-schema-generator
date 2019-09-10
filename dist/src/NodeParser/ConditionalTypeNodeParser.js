"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const NodeParser_1 = require("../NodeParser");
const isAssignableTo_1 = require("../Utils/isAssignableTo");
const narrowType_1 = require("../Utils/narrowType");
const NeverType_1 = require("../Type/NeverType");
const UnionType_1 = require("../Type/UnionType");
class ConditionalTypeNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.ConditionalType;
    }
    createType(node, context) {
        const checkType = this.childNodeParser.createType(node.checkType, context);
        const extendsType = this.childNodeParser.createType(node.extendsType, context);
        const checkTypeParameterName = this.getTypeParameterName(node.checkType);
        if (checkTypeParameterName == null) {
            const result = isAssignableTo_1.isAssignableTo(extendsType, checkType);
            return this.childNodeParser.createType(result ? node.trueType : node.falseType, context);
        }
        const trueCheckType = narrowType_1.narrowType(checkType, type => isAssignableTo_1.isAssignableTo(extendsType, type));
        const falseCheckType = narrowType_1.narrowType(checkType, type => !isAssignableTo_1.isAssignableTo(extendsType, type));
        const results = [];
        if (!(trueCheckType instanceof NeverType_1.NeverType)) {
            results.push(this.childNodeParser.createType(node.trueType, this.createSubContext(node, checkTypeParameterName, trueCheckType, context)));
        }
        if (!(falseCheckType instanceof NeverType_1.NeverType)) {
            results.push(this.childNodeParser.createType(node.falseType, this.createSubContext(node, checkTypeParameterName, falseCheckType, context)));
        }
        return new UnionType_1.UnionType(results).normalize();
    }
    getTypeParameterName(node) {
        if (ts.isTypeReferenceNode(node)) {
            const typeSymbol = this.typeChecker.getSymbolAtLocation(node.typeName);
            if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
                return typeSymbol.name;
            }
        }
        return null;
    }
    createSubContext(node, checkTypeParameterName, narrowedCheckType, parentContext) {
        const subContext = new NodeParser_1.Context(node);
        subContext.pushParameter(checkTypeParameterName);
        subContext.pushArgument(narrowedCheckType);
        parentContext.getParameters().forEach(parentParameter => {
            if (parentParameter !== checkTypeParameterName) {
                subContext.pushParameter(parentParameter);
                subContext.pushArgument(parentContext.getArgument(parentParameter));
            }
        });
        return subContext;
    }
}
exports.ConditionalTypeNodeParser = ConditionalTypeNodeParser;
//# sourceMappingURL=ConditionalTypeNodeParser.js.map