import BaseModuleContext from "./base";
declare class VueRuntimeContext extends BaseModuleContext {
    instance?: Vue;
    constructor();
    /**
     * @func { Get running environment resources }
     * @param version
     */
    getContextResource(version: string): Promise<any>;
    /**
     * @func {*} create vue runtime context
     */
    createContext(version: string): any;
    /**
     * @func { Injection router }
     */
    injectionRouter(routes: Array<any>): void;
    /**
     * @func { Uninstall the runtime environment }
     */
    destroy(): void;
}
export default VueRuntimeContext;
