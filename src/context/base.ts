
import { GlobalContext, globalContext } from '../global/index'
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

  constructor() {

  }

  // 获取运行环境沙箱
  public getSandBoxJs(type: string, version: string) {
    const url = `${this.baseUrl}/${type}/${version}/${type}.min.js`;

    return tagLoadJs(url)
  }

  abstract createContext(version: string): any
}

export default BaseModuleContext
