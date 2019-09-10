"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LiteralType_1 = require("../Type/LiteralType");
const typeName_1 = require("../Utils/typeName");
class LiteralTypeFormatter {
    supportsType(type) {
        return type instanceof LiteralType_1.LiteralType;
    }
    getDefinition(type) {
        return {
            type: typeName_1.typeName(type.getValue()),
            enum: [type.getValue()],
        };
    }
    getChildren(type) {
        return [];
    }
}
exports.LiteralTypeFormatter = LiteralTypeFormatter;
//# sourceMappingURL=LiteralTypeFormatter.js.map