import BaseModuleContext from "./base";
declare class PhaserRuntimeContext extends BaseModuleContext {
    instance?: any | null;
    element?: HTMLElement | null;
    constructor();
    /**
     * @func 获取资源
     * @param version
     */
    getContextResource(version: string): Promise<any>;
    /**
     * @func {*} Initialize the phaser operating environment
     */
    createContext(): void;
    initGame(scenes: Array<any>): any;
    /**
     * @func {*} injection routing
     */
    injectionRouter(scenes: Array<any>): void;
    /**
     * @func {*} destroy the current running instance
     * @remark {}
     */
    destroy(): void;
}
export default PhaserRuntimeContext;
