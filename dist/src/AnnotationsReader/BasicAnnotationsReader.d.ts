import * as ts from "typescript";
import { AnnotationsReader } from "../AnnotationsReader";
import { Annotations } from "../Type/AnnotatedType";
export declare class BasicAnnotationsReader implements AnnotationsReader {
    private extraJsonTags?;
    private static textTags;
    private static jsonTags;
    constructor(extraJsonTags?: string[] | undefined);
    getAnnotations(node: ts.Node): Annotations | undefined;
    private parseJsDocTag;
    private parseJson;
}
