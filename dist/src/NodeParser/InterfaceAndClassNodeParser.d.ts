import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ReferenceType } from "../Type/ReferenceType";
export declare class InterfaceAndClassNodeParser implements SubNodeParser {
    private typeChecker;
    private childNodeParser;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser);
    supportsNode(node: ts.InterfaceDeclaration | ts.ClassDeclaration): boolean;
    createType(node: ts.InterfaceDeclaration | ts.ClassDeclaration, context: Context, reference?: ReferenceType): BaseType;
    private getArrayItemType;
    private getBaseTypes;
    private getProperties;
    private getAdditionalProperties;
    private getTypeId;
}
