import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class MappedTypeNodeParser implements SubNodeParser {
    private childNodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.MappedTypeNode): boolean;
    createType(node: ts.MappedTypeNode, context: Context): BaseType;
    private getProperties;
    private getValues;
    private getAdditionalProperties;
    private createSubContext;
}
