import * as ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { ReferenceType } from "./Type/ReferenceType";
export declare class ExposeNodeParser implements SubNodeParser {
    private typeChecker;
    private subNodeParser;
    private expose;
    constructor(typeChecker: ts.TypeChecker, subNodeParser: SubNodeParser, expose: "all" | "none" | "export");
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType;
    private isExportNode;
    private getDefinitionName;
}
