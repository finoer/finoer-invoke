import BaseModuleContext from "./base";
import Phaser from 'phaser';
declare class PhaserRuntimeContext extends BaseModuleContext {
    instance?: Phaser.Game | null;
    element?: HTMLElement | null;
    constructor();
    /**
     * @func 获取资源
     * @param version
     */
    getContextResource(version: string): Promise<typeof Phaser | undefined>;
    /**
     * @func {*} 初始化phaser运行环境
     */
    createContext(): void;
    initGame(scenes: Array<Phaser.Scene>): Phaser.Game;
    /**
     * @func 注入路由
     */
    injectionRouter(scenes: Array<Phaser.Scene>): void;
    /**
     * @func {*} 销毁当前实例
     */
    destroy(): void;
}
export default PhaserRuntimeContext;
