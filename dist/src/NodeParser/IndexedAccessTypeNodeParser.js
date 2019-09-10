"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const LogicError_1 = require("../Error/LogicError");
const LiteralType_1 = require("../Type/LiteralType");
const NumberType_1 = require("../Type/NumberType");
const StringType_1 = require("../Type/StringType");
const TupleType_1 = require("../Type/TupleType");
const UnionType_1 = require("../Type/UnionType");
const derefType_1 = require("../Utils/derefType");
const typeKeys_1 = require("../Utils/typeKeys");
class IndexedAccessTypeNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.IndexedAccessType;
    }
    createType(node, context) {
        const objectType = derefType_1.derefType(this.childNodeParser.createType(node.objectType, context));
        const indexType = this.childNodeParser.createType(node.indexType, context);
        const indexTypes = indexType instanceof UnionType_1.UnionType ? indexType.getTypes() : [indexType];
        const propertyTypes = indexTypes.map(type => {
            if (!(type instanceof LiteralType_1.LiteralType || type instanceof StringType_1.StringType || type instanceof NumberType_1.NumberType)) {
                throw new LogicError_1.LogicError(`Unexpected type "${type.getId()}" (expected "LiteralType" or "StringType" or "NumberType")`);
            }
            const propertyType = typeKeys_1.getTypeByKey(objectType, type);
            if (!propertyType) {
                if (type instanceof NumberType_1.NumberType && objectType instanceof TupleType_1.TupleType) {
                    return new UnionType_1.UnionType(objectType.getTypes());
                }
                else if (type instanceof LiteralType_1.LiteralType) {
                    throw new LogicError_1.LogicError(`Invalid index "${type.getValue()}" in type "${objectType.getId()}"`);
                }
                else {
                    throw new LogicError_1.LogicError(`No additional properties in type "${objectType.getId()}"`);
                }
            }
            return propertyType;
        });
        return propertyTypes.length === 1 ? propertyTypes[0] : new UnionType_1.UnionType(propertyTypes);
    }
}
exports.IndexedAccessTypeNodeParser = IndexedAccessTypeNodeParser;
//# sourceMappingURL=IndexedAccessTypeNodeParser.js.map