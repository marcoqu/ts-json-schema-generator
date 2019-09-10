"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AnyType_1 = require("../Type/AnyType");
const ArrayType_1 = require("../Type/ArrayType");
const BaseType_1 = require("../Type/BaseType");
const IntersectionType_1 = require("../Type/IntersectionType");
const LiteralType_1 = require("../Type/LiteralType");
const NumberType_1 = require("../Type/NumberType");
const ObjectType_1 = require("../Type/ObjectType");
const TupleType_1 = require("../Type/TupleType");
const UndefinedType_1 = require("../Type/UndefinedType");
const UnionType_1 = require("../Type/UnionType");
const derefType_1 = require("./derefType");
const uniqueArray_1 = require("./uniqueArray");
function uniqueLiterals(types) {
    const values = types.map(type => type.getValue());
    return uniqueArray_1.uniqueArray(values).map(value => new LiteralType_1.LiteralType(value));
}
function getTypeKeys(type) {
    type = derefType_1.derefType(type);
    if (type instanceof IntersectionType_1.IntersectionType || type instanceof UnionType_1.UnionType) {
        return uniqueLiterals(type.getTypes().reduce((result, subType) => [...result, ...getTypeKeys(subType)], []));
    }
    if (type instanceof TupleType_1.TupleType) {
        return type.getTypes().map((it, idx) => new LiteralType_1.LiteralType(idx));
    }
    if (type instanceof ObjectType_1.ObjectType) {
        const objectProperties = type.getProperties().map(it => new LiteralType_1.LiteralType(it.getName()));
        return uniqueLiterals(type
            .getBaseTypes()
            .reduce((result, parentType) => [...result, ...getTypeKeys(parentType)], objectProperties));
    }
    return [];
}
exports.getTypeKeys = getTypeKeys;
function getTypeByKey(type, index) {
    type = derefType_1.derefType(type);
    if (type instanceof IntersectionType_1.IntersectionType || type instanceof UnionType_1.UnionType) {
        for (const subType of type.getTypes()) {
            const subKeyType = getTypeByKey(subType, index);
            if (subKeyType) {
                return subKeyType;
            }
        }
        return undefined;
    }
    if (type instanceof TupleType_1.TupleType && index instanceof LiteralType_1.LiteralType) {
        return type.getTypes().find((it, idx) => idx === index.getValue());
    }
    if (type instanceof ArrayType_1.ArrayType && index instanceof NumberType_1.NumberType) {
        return type.getItem();
    }
    if (type instanceof ObjectType_1.ObjectType) {
        if (index instanceof LiteralType_1.LiteralType) {
            const property = type.getProperties().find(it => it.getName() === index.getValue());
            if (property) {
                const propertyType = property.getType();
                if (!property.isRequired()) {
                    if (propertyType instanceof UnionType_1.UnionType) {
                        if (!propertyType.getTypes().some(subType => subType instanceof UndefinedType_1.UndefinedType)) {
                            return new UnionType_1.UnionType([...propertyType.getTypes(), new UndefinedType_1.UndefinedType()]);
                        }
                    }
                    else {
                        return new UnionType_1.UnionType([propertyType, new UndefinedType_1.UndefinedType()]);
                    }
                }
                return propertyType;
            }
        }
        const additionalProperty = type.getAdditionalProperties();
        if (additionalProperty instanceof BaseType_1.BaseType) {
            return additionalProperty;
        }
        else if (additionalProperty === true) {
            return new AnyType_1.AnyType();
        }
        for (const subType of type.getBaseTypes()) {
            const subKeyType = getTypeByKey(subType, index);
            if (subKeyType) {
                return subKeyType;
            }
        }
        return undefined;
    }
    return undefined;
}
exports.getTypeByKey = getTypeByKey;
//# sourceMappingURL=typeKeys.js.map