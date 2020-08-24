declare abstract class BaseModuleContext {
    baseUrl: string;
    constructor();
    getSandBoxJs(type: string, version: string): Promise<any>;
    abstract createContext(version: string): any;
}
export default BaseModuleContext;
