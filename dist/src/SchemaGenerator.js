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
        const rootNodes = this.getRootNodes(fullName, typeFileName);
        const rootTypes = rootNodes.map(rootNode => {
            return this.nodeParser.createType(rootNode, new NodeParser_1.Context());
        });
        const rootTypeDefinition = rootTypes.length === 1 ? this.getRootTypeDefinition(rootTypes[0]) : {};
        const definitions = {};
        rootTypes.forEach(rootType => this.appendRootChildDefinitions(rootType, definitions));
        return Object.assign(Object.assign({ $schema: "http://json-schema.org/draft-07/schema#" }, rootTypeDefinition), { definitions });
    }
    getRootNodes(fullName, typeFileName) {
        if (fullName && fullName !== "*") {
            return [this.findNamedNode(fullName, typeFileName)];
        }
        else {
            const rootFileNames = this.program.getRootFileNames();
            const rootSourceFiles = this.program
                .getSourceFiles()
                .filter(sourceFile => rootFileNames.includes(sourceFile.fileName));
            const rootNodes = new Map();
            this.appendTypes(rootSourceFiles, this.program.getTypeChecker(), rootNodes);
            return [...rootNodes.values()];
        }
    }
    findNamedNode(fullName, typeFileName) {
        const typeChecker = this.program.getTypeChecker();
        const allTypes = new Map();
        let { projectFiles, externalFiles } = this.partitionFiles();
        projectFiles = projectFiles.filter(sourceFile => {
            typeFileName ? this.isSameFile(sourceFile.fileName, typeFileName) : true;
        });
        this.appendTypes(projectFiles, typeChecker, allTypes);
        if (allTypes.has(fullName)) {
            return allTypes.get(fullName);
        }
        this.appendTypes(externalFiles, typeChecker, allTypes);
        if (allTypes.has(fullName)) {
            return allTypes.get(fullName);
        }
        throw new NoRootTypeError_1.NoRootTypeError(fullName);
    }
    getRootTypeDefinition(rootType) {
        return this.typeFormatter.getDefinition(rootType);
    }
    appendRootChildDefinitions(rootType, childDefinitions) {
        const seen = new Set();
        const children = this.typeFormatter
            .getChildren(rootType)
            .filter((child) => child instanceof DefinitionType_1.DefinitionType)
            .filter(child => {
            if (!seen.has(child.getId())) {
                seen.add(child.getId());
                return true;
            }
            return false;
        });
        children.reduce((definitions, child) => {
            const name = child.getName();
            if (name in definitions) {
                throw new Error(`Type "${name}" has multiple definitions.`);
            }
            definitions[name] = this.typeFormatter.getDefinition(child.getType());
            return definitions;
        }, childDefinitions);
    }
    partitionFiles() {
        const projectFiles = new Array();
        const externalFiles = new Array();
        for (const sourceFile of this.program.getSourceFiles()) {
            const destination = sourceFile.fileName.includes("/node_modules/") ? externalFiles : projectFiles;
            destination.push(sourceFile);
        }
        return { projectFiles, externalFiles };
    }
    appendTypes(sourceFiles, typeChecker, types) {
        for (const sourceFile of sourceFiles) {
            this.inspectNode(sourceFile, typeChecker, types);
        }
    }
    isSameFile(fileNameA, fileNameB) {
        return path.normalize(fileNameA) === path.normalize(fileNameB);
    }
    inspectNode(node, typeChecker, allTypes) {
        switch (node.kind) {
            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.EnumDeclaration:
            case ts.SyntaxKind.TypeAliasDeclaration:
                if (!this.isExportType(node) || this.isGenericType(node)) {
                    return;
                }
                allTypes.set(this.getFullName(node, typeChecker), node);
                break;
            default:
                ts.forEachChild(node, subnode => this.inspectNode(subnode, typeChecker, allTypes));
                break;
        }
    }
    isExportType(node) {
        const localSymbol = symbolAtNode_1.localSymbolAtNode(node);
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    isGenericType(node) {
        return !!(node.typeParameters && node.typeParameters.length > 0);
    }
    getFullName(node, typeChecker) {
        const symbol = symbolAtNode_1.symbolAtNode(node);
        return typeChecker.getFullyQualifiedName(symbol).replace(/".*"\./, "");
    }
}
exports.SchemaGenerator = SchemaGenerator;
//# sourceMappingURL=SchemaGenerator.js.map