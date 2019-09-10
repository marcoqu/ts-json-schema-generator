"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UnknownType_1 = require("../Type/UnknownType");
class UnknownTypeFormatter {
    supportsType(type) {
        return type instanceof UnknownType_1.UnknownType;
    }
    getDefinition(type) {
        return {};
    }
    getChildren(type) {
        return [];
    }
}
exports.UnknownTypeFormatter = UnknownTypeFormatter;
//# sourceMappingURL=UnknownTypeFormatter.js.map