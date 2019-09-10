import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";
export declare class TypeLiteralNodeParser implements SubNodeParser {
    private childNodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.TypeLiteralNode): boolean;
    createType(node: ts.TypeLiteralNode, context: Context, reference?: ReferenceType): BaseType;
    private getProperties;
    private getAdditionalProperties;
    private getTypeId;
}
