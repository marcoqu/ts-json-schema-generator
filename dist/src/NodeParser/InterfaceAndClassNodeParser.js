"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const ArrayType_1 = require("../Type/ArrayType");
const ObjectType_1 = require("../Type/ObjectType");
const isHidden_1 = require("../Utils/isHidden");
const modifiers_1 = require("../Utils/modifiers");
const nodeKey_1 = require("../Utils/nodeKey");
class InterfaceAndClassNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.InterfaceDeclaration || node.kind === ts.SyntaxKind.ClassDeclaration;
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
        const properties = this.getProperties(node, context);
        const additionalProperties = this.getAdditionalProperties(node, context);
        if (properties.length === 0 && additionalProperties === false) {
            const arrayItemType = this.getArrayItemType(node);
            if (arrayItemType) {
                return new ArrayType_1.ArrayType(this.childNodeParser.createType(arrayItemType, context));
            }
        }
        return new ObjectType_1.ObjectType(id, this.getBaseTypes(node, context), properties, additionalProperties);
    }
    getArrayItemType(node) {
        if (node.heritageClauses && node.heritageClauses.length === 1) {
            const clause = node.heritageClauses[0];
            if (clause.types.length === 1) {
                const type = clause.types[0];
                const symbol = this.typeChecker.getSymbolAtLocation(type.expression);
                if (symbol && (symbol.name === "Array" || symbol.name === "ReadonlyArray")) {
                    const typeArguments = type.typeArguments;
                    if (typeArguments && typeArguments.length === 1) {
                        return typeArguments[0];
                    }
                }
            }
        }
        return null;
    }
    getBaseTypes(node, context) {
        if (!node.heritageClauses) {
            return [];
        }
        return node.heritageClauses.reduce((result, baseType) => [
            ...result,
            ...baseType.types.map(expression => this.childNodeParser.createType(expression, context)),
        ], []);
    }
    getProperties(node, context) {
        return node.members
            .reduce((members, member) => {
            if (ts.isConstructorDeclaration(member)) {
                members.push(...member.parameters.filter(ts.isParameterPropertyDeclaration));
            }
            else if (ts.isPropertySignature(member) || ts.isPropertyDeclaration(member)) {
                members.push(member);
            }
            return members;
        }, [])
            .filter(member => modifiers_1.isPublic(member) && !modifiers_1.isStatic(member) && member.type && !isHidden_1.isNodeHidden(member))
            .map(member => new ObjectType_1.ObjectProperty(member.name.getText(), this.childNodeParser.createType(member.type, context), !member.questionToken));
    }
    getAdditionalProperties(node, context) {
        const indexSignature = node.members.find(ts.isIndexSignatureDeclaration);
        if (!indexSignature) {
            return false;
        }
        return this.childNodeParser.createType(indexSignature.type, context);
    }
    getTypeId(node, context) {
        const nodeType = ts.isInterfaceDeclaration(node) ? "interface" : "class";
        return `${nodeType}-${nodeKey_1.getKey(node, context)}`;
    }
}
exports.InterfaceAndClassNodeParser = InterfaceAndClassNodeParser;
//# sourceMappingURL=InterfaceAndClassNodeParser.js.map