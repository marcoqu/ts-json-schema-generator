"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EnumType_1 = require("../Type/EnumType");
const typeName_1 = require("../Utils/typeName");
const uniqueArray_1 = require("../Utils/uniqueArray");
class EnumTypeFormatter {
    supportsType(type) {
        return type instanceof EnumType_1.EnumType;
    }
    getDefinition(type) {
        const values = uniqueArray_1.uniqueArray(type.getValues());
        const types = uniqueArray_1.uniqueArray(values.map(typeName_1.typeName));
        return {
            type: types.length === 1 ? types[0] : types,
            enum: values,
        };
    }
    getChildren(type) {
        return [];
    }
}
exports.EnumTypeFormatter = EnumTypeFormatter;
//# sourceMappingURL=EnumTypeFormatter.js.map