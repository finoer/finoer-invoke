import BaseModuleContext from "./base";
import { RouteConfig } from 'vue-router';
declare class VueRuntimeContext extends BaseModuleContext {
    instance?: Vue;
    constructor();
    /**
     * @func {*} 初始化vue运行环境
     */
    createContext(version: string): Promise<import("vue/types/umd")>;
    /**
     * @func 注入路由
     */
    injectionRouter(routes: Array<RouteConfig>): void;
}
export default VueRuntimeContext;
