import { BaseType } from "../Type/BaseType";
import { TypeFormatter } from "../TypeFormatter";
export declare function getAllOfDefinitionReducer(childTypeFormatter: TypeFormatter, concatArrays: boolean): (definition: import("json-schema").JSONSchema7, baseType: BaseType) => import("json-schema").JSONSchema7;
