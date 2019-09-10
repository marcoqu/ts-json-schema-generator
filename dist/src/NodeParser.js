"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringify = require("json-stable-stringify");
const LogicError_1 = require("./Error/LogicError");
const nodeKey_1 = require("./Utils/nodeKey");
class Context {
    constructor(reference) {
        this.cacheKey = null;
        this.arguments = [];
        this.parameters = [];
        this.defaultArgument = new Map();
        this.reference = reference;
    }
    pushArgument(argumentType) {
        this.arguments.push(argumentType);
        this.cacheKey = null;
    }
    pushParameter(parameterName) {
        this.parameters.push(parameterName);
    }
    setDefault(parameterName, argumentType) {
        this.defaultArgument.set(parameterName, argumentType);
    }
    getCacheKey() {
        if (this.cacheKey == null) {
            this.cacheKey = stringify([
                this.reference ? nodeKey_1.getKey(this.reference, this) : "",
                this.arguments.map(argument => argument.getId()),
            ]);
        }
        return this.cacheKey;
    }
    getArgument(parameterName) {
        const index = this.parameters.indexOf(parameterName);
        if (index < 0 || !this.arguments[index]) {
            if (this.defaultArgument.has(parameterName)) {
                return this.defaultArgument.get(parameterName);
            }
            throw new LogicError_1.LogicError(`Could not find type parameter "${parameterName}"`);
        }
        return this.arguments[index];
    }
    getParameters() {
        return this.parameters;
    }
    getArguments() {
        return this.arguments;
    }
    getReference() {
        return this.reference;
    }
}
exports.Context = Context;
//# sourceMappingURL=NodeParser.js.map