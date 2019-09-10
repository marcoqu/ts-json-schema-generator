import { BaseType } from "./BaseType";
export declare class UnionType extends BaseType {
    private readonly types;
    constructor(types: BaseType[]);
    getId(): string;
    getName(): string;
    getTypes(): BaseType[];
    normalize(): BaseType;
}
