export interface Config {
    path?: string;
    type?: string;
    tsconfig?: string;
    expose: "all" | "none" | "export";
    topRef: boolean;
    jsDoc: "none" | "extended" | "basic";
    sortProps?: boolean;
    skipTypeCheck?: boolean;
    extraJsonTags?: string[];
    typeFile?: string;
}
export declare const DEFAULT_CONFIG: Config;
