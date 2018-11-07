export interface PartialConfig {
    expose: "all" | "none" | "export";
    topRef: boolean;
    jsDoc: "none" | "extended" | "basic";
    sortProps?: boolean;
    skipTypeCheck?: boolean;
}
export interface Config extends PartialConfig {
    path: string;
    type: string;
    typeFile?: string;
}
export declare const DEFAULT_CONFIG: PartialConfig;
