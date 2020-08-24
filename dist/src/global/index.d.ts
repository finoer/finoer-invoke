import Vue from 'vue';
import { Project } from "../project";
import { VueConstructor } from "vue/types/umd";
/**
 * @class 全局单例
 */
export declare class GlobalContext {
    activedApplication: Project;
    activeAppInfo: any;
    activeContext: VueConstructor<Vue> | Window | any;
    constructor();
    setRuntimeContext<RuntimeContextType>(context: RuntimeContextType): void;
}
export declare const globalContext: GlobalContext;
