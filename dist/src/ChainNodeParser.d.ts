import * as ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
import { ReferenceType } from "./Type/ReferenceType";
export declare class ChainNodeParser implements SubNodeParser {
    private typeChecker;
    private nodeParsers;
    private typeCaches;
    constructor(typeChecker: ts.TypeChecker, nodeParsers: SubNodeParser[]);
    addNodeParser(nodeParser: SubNodeParser): this;
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType;
    private getNodeParser;
}
