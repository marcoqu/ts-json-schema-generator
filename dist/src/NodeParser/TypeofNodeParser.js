"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const LogicError_1 = require("../Error/LogicError");
const ObjectType_1 = require("../Type/ObjectType");
const nodeKey_1 = require("../Utils/nodeKey");
const LiteralType_1 = require("../Type/LiteralType");
class TypeofNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.TypeQuery;
    }
    createType(node, context, reference) {
        let symbol = this.typeChecker.getSymbolAtLocation(node.exprName);
        if (symbol.flags & ts.SymbolFlags.Alias) {
            symbol = this.typeChecker.getAliasedSymbol(symbol);
        }
        const valueDec = symbol.valueDeclaration;
        if (ts.isEnumDeclaration(valueDec)) {
            return this.createObjectFromEnum(valueDec, context, reference);
        }
        else if (ts.isVariableDeclaration(valueDec) || ts.isPropertySignature(valueDec)) {
            if (valueDec.type) {
                return this.childNodeParser.createType(valueDec.type, context);
            }
            else if (valueDec.initializer) {
                return this.childNodeParser.createType(valueDec.initializer, context);
            }
        }
        throw new LogicError_1.LogicError(`Invalid type query "${valueDec.getFullText()}" (ts.SyntaxKind = ${valueDec.kind})`);
    }
    createObjectFromEnum(node, context, reference) {
        const id = `typeof-enum-${nodeKey_1.getKey(node, context)}`;
        if (reference) {
            reference.setId(id);
            reference.setName(id);
        }
        let type = null;
        const properties = node.members.map(member => {
            const name = member.name.getText();
            if (member.initializer) {
                type = this.childNodeParser.createType(member.initializer, context);
            }
            else if (type === null) {
                type = new LiteralType_1.LiteralType(0);
            }
            else if (type instanceof LiteralType_1.LiteralType && typeof type.getValue() === "number") {
                type = new LiteralType_1.LiteralType(+type.getValue() + 1);
            }
            else {
                throw new LogicError_1.LogicError(`Enum initializer missing for "${name}"`);
            }
            return new ObjectType_1.ObjectProperty(name, type, true);
        });
        return new ObjectType_1.ObjectType(id, [], properties, false);
    }
}
exports.TypeofNodeParser = TypeofNodeParser;
//# sourceMappingURL=TypeofNodeParser.js.map