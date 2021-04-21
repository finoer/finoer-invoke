
/**
 * @class 管理子模块的运行环境
 * @mehtods {*} createContext
 * @mehtods {*} loadContext
 * @mehtods {*} unmountContext
 */

import { tagLoadJs } from "../loader";

abstract class BaseModuleContext {
  // 资源的base url
  public baseUrl: string = `https://cdn.bootcdn.net/ajax/libs`;

  public context: string = ""

  constructor(type: string) {
    this.context = type
  }

  // 获取运行环境沙箱
  public getSandBoxJs(type: string, version: string, name?: string) {
    const _name = (name && name + '.global.prod') || type + '.min'
    const url = name === 'vue' ? "https://unpkg.com/vue@next" :
      `${this.baseUrl}/${type}/${version}/${_name}.js`
    return tagLoadJs(url)
  }

  abstract createContext(version: string): any

  abstract destroy(): void
}

export default BaseModuleContext
