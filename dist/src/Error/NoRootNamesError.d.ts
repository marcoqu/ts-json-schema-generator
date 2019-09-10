import { BaseError } from "./BaseError";
export declare class NoRootNamesError extends BaseError {
    readonly name: string;
    readonly message: string;
}
