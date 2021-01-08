/**
 * @class 管理子模块的运行环境
 * @mehtods {*} createContext
 * @mehtods {*} loadContext
 * @mehtods {*} unmountContext
 */
declare abstract class BaseModuleContext {
    baseUrl: string;
    context: string;
    constructor(type: string);
    getSandBoxJs(type: string, version: string): Promise<any>;
    abstract createContext(version: string): any;
    abstract destroy(): void;
}
export default BaseModuleContext;
