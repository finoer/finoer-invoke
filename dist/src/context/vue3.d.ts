import BaseModuleContext from "./base";
declare class Vue3RuntimeContext extends BaseModuleContext {
    instance?: any;
    constructor();
    /**
     * @func { Get running environment resources }
     * @param version
     */
    getContextResource(version: string): Promise<any>;
    createContext(version: string): any;
    /**
    * @func { Injection router }
    */
    injectionRouter(routes: Array<any>): void;
    destroy(): void;
}
export default Vue3RuntimeContext;
