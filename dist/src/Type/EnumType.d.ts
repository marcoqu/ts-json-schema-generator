import { BaseType } from "./BaseType";
export declare type EnumValue = string | boolean | number | null;
export declare class EnumType extends BaseType {
    private id;
    private values;
    private types;
    constructor(id: string, values: EnumValue[]);
    getId(): string;
    getValues(): EnumValue[];
    getTypes(): BaseType[];
}
