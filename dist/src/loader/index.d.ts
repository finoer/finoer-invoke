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
export declare function getEntryJs(url: string): Promise<any>;
/**
 * 预备加载问题
 * @param source
 * @param { type } (script || style)  https://developer.mozilla.org/zh-CN/docs/Web/HTML/Preloading_content
 */
export declare function createPreloadLink(source: string, type: string): void;
export declare function loadCss(cssList: string[]): Promise<void>;
