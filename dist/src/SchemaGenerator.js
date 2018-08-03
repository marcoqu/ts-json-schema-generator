"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ts = require("typescript");
const NoRootTypeError_1 = require("./Error/NoRootTypeError");
const NodeParser_1 = require("./NodeParser");
const DefinitionType_1 = require("./Type/DefinitionType");
const symbolAtNode_1 = require("./Utils/symbolAtNode");
class SchemaGenerator {
    constructor(program, nodeParser, typeFormatter) {
        this.program = program;
        this.nodeParser = nodeParser;
        this.typeFormatter = typeFormatter;
    }
    createSchema(fullName, typeFileName) {
        const rootNode = this.findRootNode(fullName, typeFileName);
        const rootType = this.nodeParser.createType(rootNode, new NodeParser_1.Context());
        return Object.assign({ $schema: "http://json-schema.org/draft-06/schema#", definitions: this.getRootChildDefinitions(rootType) }, this.getRootTypeDefinition(rootType));
    }
    findRootNode(fullName, typeFileName) {
        const typeChecker = this.program.getTypeChecker();
        if (!this.allTypes) {
            this.allTypes = new Map();
            this.program.getSourceFiles()
                .filter((sourceFile) => typeFileName ? this.isSameFile(sourceFile.fileName, typeFileName) : true)
                .forEach((sourceFile) => this.inspectNode(sourceFile, typeChecker, this.allTypes));
        }
        if (!this.allTypes.has(fullName)) {
            throw new NoRootTypeError_1.NoRootTypeError(fullName);
        }
        return this.allTypes.get(fullName);
    }
    isSameFile(fileNameA, fileNameB) {
        return path.normalize(fileNameA) === path.normalize(fileNameB);
    }
    inspectNode(node, typeChecker, allTypes) {
        if (node.kind === ts.SyntaxKind.InterfaceDeclaration ||
            node.kind === ts.SyntaxKind.EnumDeclaration ||
            node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
            if (!this.isExportType(node)) {
                return;
            }
            else if (this.isGenericType(node)) {
                return;
            }
            allTypes.set(this.getFullName(node, typeChecker), node);
        }
        else {
            ts.forEachChild(node, (subnode) => this.inspectNode(subnode, typeChecker, allTypes));
        }
    }
    isExportType(node) {
        const localSymbol = symbolAtNode_1.localSymbolAtNode(node);
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    isGenericType(node) {
        return !!(node.typeParameters &&
            node.typeParameters.length > 0);
    }
    getFullName(node, typeChecker) {
        const symbol = symbolAtNode_1.symbolAtNode(node);
        return typeChecker.getFullyQualifiedName(symbol).replace(/".*"\./, "");
    }
    getRootTypeDefinition(rootType) {
        return this.typeFormatter.getDefinition(rootType);
    }
    getRootChildDefinitions(rootType) {
        return this.typeFormatter.getChildren(rootType)
            .filter((child) => child instanceof DefinitionType_1.DefinitionType)
            .reduce((result, child) => (Object.assign({}, result, { [child.getId()]: this.typeFormatter.getDefinition(child.getType()) })), {});
    }
}
exports.SchemaGenerator = SchemaGenerator;
//# sourceMappingURL=SchemaGenerator.js.map