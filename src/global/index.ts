// import apps from "../model"
import Vue from 'vue'
import { Project } from "../types/project"
import { VueConstructor } from "vue/types/umd"
import { Apps } from '../applycation/register'
import { GlobalType } from '../types/context'
import { AppInfoType } from '../types/project/appInfo'
// import Database from '../../../fino-database'

interface CacheType {
  [propsName:string]: boolean;
}
/**
 * @class 全局单例
 */
export class GlobalContext {
  // 当前正在运行的子模块
  public activedApplication: Project

  // 当前需要加载的子模块
  public activeAppInfo: AppInfoType = {
    app: '',
    context: '',
    version: ''
  }

  // 资源缓存
  public contextSourceCache: CacheType = {};

  // 当前运行环境
  public activeContext: VueConstructor<Vue> | Window | any

  constructor() {
    this.activedApplication = Apps[0]

    this.activeContext = window
  }

  // 设置运行环境
  public setRuntimeContext<RuntimeContextType>(context: RuntimeContextType) {
    this.activeContext = context
  }
}



function getGlobalContext() {
  const global: GlobalType = window;

  if(global.globalContext) {
    return global.globalContext;
  }

  global.globalContext = new GlobalContext()

  return global.globalContext
}

export const globalContext = getGlobalContext()



