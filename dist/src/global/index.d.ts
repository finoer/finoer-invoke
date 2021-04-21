import { Project } from "../types/project";
import { AppInfoType } from '../types/project/appInfo';
interface CacheType {
    [propsName: string]: boolean;
}
/**
 * @class 全局单例
 */
export declare class GlobalContext {
    activedApplication: Project;
    activeAppInfo: AppInfoType;
    contextSourceCache: CacheType;
    activeContext: Window | any;
    constructor();
    setRuntimeContext<RuntimeContextType>(context: RuntimeContextType): void;
}
export declare const globalContext: GlobalContext;
export {};
