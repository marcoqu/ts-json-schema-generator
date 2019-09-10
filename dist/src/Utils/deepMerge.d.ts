export declare function deepMerge<T>(a: Partial<T>, b: Partial<T>, intersectArrays: boolean): T;
export declare function deepMerge<A, B>(a: A, b: B, intersectArrays: boolean): A & B | B;
