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
     * @remark phaser3.23不可以异步注入场景， 因此需要在注入路由的时候创建实例
     */
    createContext(): void;
    initGame(scenes: Array<any>): Phaser.Game;
    /**
     * @func {*} injection routing
     */
    injectionRouter(scenes: Array<any>): void;
    stop(): void;
    /**
     * @func {*} destroy the current running instance
     */
    destroy(): void;
}
export default PhaserRuntimeContext;
