import BaseModuleContext from "./base";
declare class VueRuntimeContext extends BaseModuleContext {
    instance?: Vue;
    constructor();
    /**
     * @func 获取资源
     * @param version
     */
    getContextResource(version: string): Promise<any>;
    /**
     * @func {*} 初始化vue运行环境
     */
    createContext(version: string): any;
    /**
     * @func 注入路由
     */
    injectionRouter(routes: Array<any>): void;
    /**
     * @func 卸载运行环境
     */
    destroy(): void;
}
export default VueRuntimeContext;
