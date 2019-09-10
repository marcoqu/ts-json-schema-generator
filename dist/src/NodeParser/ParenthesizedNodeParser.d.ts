import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class ParenthesizedNodeParser implements SubNodeParser {
    private childNodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.ParenthesizedTypeNode): boolean;
    createType(node: ts.ParenthesizedTypeNode, context: Context): BaseType;
}
