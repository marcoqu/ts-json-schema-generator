"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const LogicError_1 = require("../Error/LogicError");
const NodeParser_1 = require("../NodeParser");
const ArrayType_1 = require("../Type/ArrayType");
const LiteralType_1 = require("../Type/LiteralType");
const NumberType_1 = require("../Type/NumberType");
const ObjectType_1 = require("../Type/ObjectType");
const StringType_1 = require("../Type/StringType");
const UnionType_1 = require("../Type/UnionType");
const derefType_1 = require("../Utils/derefType");
const nodeKey_1 = require("../Utils/nodeKey");
const EnumType_1 = require("../Type/EnumType");
class MappedTypeNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.MappedType;
    }
    createType(node, context) {
        const constraintType = this.childNodeParser.createType(node.typeParameter.constraint, context);
        const keyListType = derefType_1.derefType(constraintType);
        const id = `indexed-type-${nodeKey_1.getKey(node, context)}`;
        if (keyListType instanceof UnionType_1.UnionType) {
            return new ObjectType_1.ObjectType(id, [], this.getProperties(node, keyListType, context), this.getAdditionalProperties(node, keyListType, context));
        }
        else if (keyListType instanceof LiteralType_1.LiteralType) {
            return new ObjectType_1.ObjectType(id, [], this.getProperties(node, new UnionType_1.UnionType([keyListType]), context), false);
        }
        else if (keyListType instanceof StringType_1.StringType) {
            return new ObjectType_1.ObjectType(id, [], [], this.childNodeParser.createType(node.type, context));
        }
        else if (keyListType instanceof NumberType_1.NumberType) {
            return new ArrayType_1.ArrayType(this.childNodeParser.createType(node.type, this.createSubContext(node, keyListType, context)));
        }
        else if (keyListType instanceof EnumType_1.EnumType) {
            return new ObjectType_1.ObjectType(id, [], this.getValues(node, keyListType, context), false);
        }
        else {
            throw new LogicError_1.LogicError(`Unexpected key type "${constraintType.getId()}" for type "${node.getText()}" (expected "UnionType" or "StringType")`);
        }
    }
    getProperties(node, keyListType, context) {
        return keyListType
            .getTypes()
            .filter(type => type instanceof LiteralType_1.LiteralType)
            .reduce((result, key) => {
            const objectProperty = new ObjectType_1.ObjectProperty(key.getValue().toString(), this.childNodeParser.createType(node.type, this.createSubContext(node, key, context)), !node.questionToken);
            result.push(objectProperty);
            return result;
        }, []);
    }
    getValues(node, keyListType, context) {
        return keyListType
            .getValues()
            .filter((value) => !!value)
            .map((value) => new ObjectType_1.ObjectProperty(value.toString(), this.childNodeParser.createType(node.type, this.createSubContext(node, new LiteralType_1.LiteralType(value), context)), !node.questionToken));
    }
    getAdditionalProperties(node, keyListType, context) {
        const key = keyListType.getTypes().filter(type => !(type instanceof LiteralType_1.LiteralType))[0];
        if (key) {
            return this.childNodeParser.createType(node.type, this.createSubContext(node, key, context));
        }
        else {
            return false;
        }
    }
    createSubContext(node, key, parentContext) {
        const subContext = new NodeParser_1.Context(node);
        parentContext.getParameters().forEach(parentParameter => {
            subContext.pushParameter(parentParameter);
            subContext.pushArgument(parentContext.getArgument(parentParameter));
        });
        subContext.pushParameter(node.typeParameter.name.text);
        subContext.pushArgument(key);
        return subContext;
    }
}
exports.MappedTypeNodeParser = MappedTypeNodeParser;
//# sourceMappingURL=MappedTypeNodeParser.js.map