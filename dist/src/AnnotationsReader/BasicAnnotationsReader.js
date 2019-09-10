"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const symbolAtNode_1 = require("../Utils/symbolAtNode");
class BasicAnnotationsReader {
    constructor(extraJsonTags) {
        this.extraJsonTags = extraJsonTags;
    }
    getAnnotations(node) {
        const symbol = symbolAtNode_1.symbolAtNode(node);
        if (!symbol) {
            return undefined;
        }
        const jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }
        const annotations = jsDocTags.reduce((result, jsDocTag) => {
            const value = this.parseJsDocTag(jsDocTag);
            if (value !== undefined) {
                result[jsDocTag.name] = value;
            }
            return result;
        }, {});
        return Object.keys(annotations).length ? annotations : undefined;
    }
    parseJsDocTag(jsDocTag) {
        if (!jsDocTag.text) {
            return undefined;
        }
        if (BasicAnnotationsReader.textTags.indexOf(jsDocTag.name) >= 0) {
            return jsDocTag.text;
        }
        else if (BasicAnnotationsReader.jsonTags.indexOf(jsDocTag.name) >= 0) {
            return this.parseJson(jsDocTag.text);
        }
        else if (this.extraJsonTags && this.extraJsonTags.indexOf(jsDocTag.name) >= 0) {
            return this.parseJson(jsDocTag.text);
        }
        else {
            return undefined;
        }
    }
    parseJson(value) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return undefined;
        }
    }
}
exports.BasicAnnotationsReader = BasicAnnotationsReader;
BasicAnnotationsReader.textTags = [
    "title",
    "description",
    "format",
    "pattern",
    "$comment",
    "contentMediaType",
    "contentEncoding",
];
BasicAnnotationsReader.jsonTags = [
    "minimum",
    "exclusiveMinimum",
    "maximum",
    "exclusiveMaximum",
    "multipleOf",
    "minLength",
    "maxLength",
    "minProperties",
    "maxProperties",
    "minItems",
    "maxItems",
    "uniqueItems",
    "propertyNames",
    "contains",
    "const",
    "examples",
    "default",
    "if",
    "then",
    "else",
    "readOnly",
    "writeOnly",
];
//# sourceMappingURL=BasicAnnotationsReader.js.map