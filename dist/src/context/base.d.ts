declare abstract class BaseModuleContext {
    baseUrl: string;
    context: string;
    constructor(type: string);
    getSandBoxJs(type: string, version: string): Promise<any>;
    abstract createContext(version: string): any;
    abstract destroy(): void;
}
export default BaseModuleContext;
