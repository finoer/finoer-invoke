import Vue from 'vue';
import { Project } from "../project";
import { VueConstructor } from "vue/types/umd";
import { AppInfoType } from '../project/appInfo';
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
    activeContext: VueConstructor<Vue> | Window | any;
    constructor();
    setRuntimeContext<RuntimeContextType>(context: RuntimeContextType): void;
}
export declare const globalContext: GlobalContext;
export {};
