import { BaseError } from "./BaseError";
export declare class NoTSConfigError extends BaseError {
    readonly name: string;
    readonly message: string;
}
