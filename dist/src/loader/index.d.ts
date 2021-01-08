export declare enum AssetTypeEnum {
    INLINE = "inline",
    EXTERNAL = "external"
}
export interface Asset {
    type: AssetTypeEnum;
    content: string;
}
export declare function ajaxLoadJs(src: string): Promise<any>;
export declare function tagLoadJs(src: string): Promise<any>;
export declare function tagLoadCss(link: string): Promise<any>;
