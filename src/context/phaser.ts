import BaseModuleContext from "./base";
import { tagLoadJs } from "../loader";
import { globalContext } from "../global";
import { WINDOW_WIDTH, WINDOW_HEIGHT } from "../utils/contants";

/// <reference path="../types/phaser.d.ts" />

class PhaserRuntimeContext extends BaseModuleContext {
    // 当前runtime
    public instance?: any | null

    // 实例
    public element?: HTMLElement | null

    constructor() {
        super("phaser")
    }

    /**
     * @func 获取资源
     * @param version
     */
    async getContextResource(version: string) {
        if (globalContext.contextSourceCache.phaser) {
            return
        }
        // 获取当前运行环境所需的资源
        const context = await this.getSandBoxJs('phaser', version)
        await tagLoadJs('https://s.vipkidstatic.com/SpinePlugin.min.js')
        //
        const Phaser = (window as any)['Phaser'];

        globalContext.contextSourceCache.phaser = true
        globalContext.contextSourceCache.SpinePlugin = true

        return Phaser
    }

    /**
     * @func {*} Initialize the phaser operating environment
     * @remark phaser3.23不可以异步注入场景， 因此需要在注入路由的时候创建实例
     */
    createContext() {
        // 
    }

    initGame(scenes: Array<any>) {
        const root = document.createElement('div')
        root.id = 'fino-root-phaser'
        document.body.appendChild(root)
        // Create game instance
        const gameConfig: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: WINDOW_WIDTH,
            height: WINDOW_HEIGHT,
            autoFocus: true,
            transparent: true,
            resolution: 1,
            parent: root,
            scene: scenes,
            plugins: {
                scene: [
                    {
                        key: 'SpinePlugin',
                        plugin: (window as any)['SpinePlugin'],
                        mapping: 'spine'
                    }
                ]
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            render: {
                antialias: true, // 抗锯齿
                antialiasGL: false, // GL抗锯齿
                desynchronized: false, // 异步
                pixelArt: false, // 像素化
                roundPixels: false, // 圆形像素
                transparent: true, // 透明的
                clearBeforeRender: true, // 渲染前清除
                failIfMajorPerformanceCaveat: true, // 重大绩效警告失败
                powerPreference: 'default', // 'high-performance', 'low-power' or 'default'
                batchSize: 4096,
                maxLights: 10, // 最大亮度
                // 纹理过渡方式
                mipmapFilter: 'NEAREST_MIPMAP_NEAREST', // 'NEAREST', 'LINEAR', 'NEAREST_MIPMAP_NEAREST', 'LINEAR_MIPMAP_NEAREST', 'NEAREST_MIPMAP_LINEAR', 'LINEAR_MIPMAP_LINEAR'
            },

            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 600 },
                    debug: true
                }
            },
            fps: {
                min: 10,
                target: 60,
                forceSetTimeOut: false,
                deltaHistory: 50,
            }

        }

        // debugger
        const game = new Phaser.Game(gameConfig)

        return game
    }

    /**
     * @func {*} injection routing
     */
    injectionRouter(scenes: Array<any>,) {
        const sceneInfo = scenes[scenes.length - 1]
        if (!this.instance) {

            this.instance = this.initGame(sceneInfo.scene)

            scenes.pop()
        }

        let isInjection = false

        let canvas = document.querySelector('canvas')
        canvas && canvas.setAttribute('style', `display: block;maring:0;padding:0`)

        // 停止到当前所有的场景
        const instance = (this.instance as Phaser.Game)
        scenes.map((item, index) => {
            if (instance.scene.getScene(item.name)) {
                instance.scene.remove(item.name);
            }

            if ((index === scenes.length - 1 && instance.scene.scenes.length > 0) || instance.scene.scenes.length === 0) {
                instance.scene.add(item.name, item.scene, true);
            } else {
                instance.scene.add(item.name, item.scene)
            }
        })


    }

    stop() {
        this.instance &&
            this.instance.scene.scenes.forEach((item: Phaser.Scene | string) => {
                (item as Phaser.Scene).scene.stop((item as string))
            })
    }


    /**
     * @func {*} destroy the current running instance
     */
    destroy() {
        if (!this.instance) { return }

        let canvas = document.querySelector('#fino-root-phaser')
        canvas && document.body.removeChild(canvas)
        this.instance.destroy(true);
        this.instance.plugins.removeScenePlugin('SpinePlugin')
        this.instance = null
    }
}




export default PhaserRuntimeContext
