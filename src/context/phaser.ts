import BaseModuleContext from "./base";
import { tagLoadJs } from "../loader";
import Phaser from 'phaser'
import { globalContext } from "../global";
import { ConstraintFactory } from "matter";


class PhaserRuntimeContext extends BaseModuleContext {
  // 当前runtime
  public instance?: Phaser.Game | null

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
    if(globalContext.contextSourceCache.phaser) {
      return
    }
    // 获取当前运行环境所需的资源
    // const context = await this.getSandBoxJs('phaser', version)
    const plugin = await tagLoadJs('https://s.vipkidstatic.com/phaser/SpinePlugin.min.js')
//
    globalContext.contextSourceCache.phaser = true
    globalContext.contextSourceCache.SpinePlugin = true

    return Phaser
  }

  /**
   * @func {*} 初始化phaser运行环境
   */
  createContext() {
    // phaser3.23不可以异步注入场景， 因此需要在注入路由的时候创建实例

  }

  initGame(scenes: Array<Phaser.Scene>) {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
    // 创建游戏实例
    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: 2,
      autoFocus: true,
      transparent: true,
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
    }

    // debugger
    const game = new Phaser.Game(gameConfig)

    return game
  }

  /**
   * @func 注入路由
   */
  injectionRouter(scenes: Array<Phaser.Scene>, ) {
    if(!this.instance) {
      this.instance = this.initGame([scenes[scenes.length - 1]])
      scenes.pop()
    }

    let canvas = document.querySelector('#root')
    canvas && canvas.setAttribute('style', `display: block`)

    Object.keys(scenes).map((key, index) => {
      this.instance && this.instance.scene.add((scenes as any)[(key)].name, scenes[index])
    })
  }


  /**
   * @func {*} 销毁当前运行实例
   * @remark {}
   */
  destroy() {
    if(!this.instance) {
      return
    }

    let canvas = document.querySelector('#root')
    canvas && document.body.removeChild(canvas)
    this.instance.destroy(true);
    this.instance.plugins.removeScenePlugin('SpinePlugin')
  }
}

export default PhaserRuntimeContext
