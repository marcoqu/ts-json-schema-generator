export interface PartialConfig {

    expose: "all" | "none" | "export";
    topRef: boolean;
    jsDoc: "none" | "extended" | "basic";
    sortProps?: boolean;
    skipTypeCheck?: boolean;
    extraJsonTags?: string[];
}

export interface Config extends PartialConfig {
    path: string;
    type: string;
    typeFile?: string;
}

export const DEFAULT_CONFIG: PartialConfig = {
    expose: "export",
    topRef: true,
    jsDoc: "extended",
    sortProps: true,
    skipTypeCheck: false,
    extraJsonTags: [],
};
