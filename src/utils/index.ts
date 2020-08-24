import { Project } from "../project";
// import apps from '../model/index'
import { globalContext } from "../global";
import { GlobalType } from "../types/context";

/**
 * @function 获取当前应该被加载的应用
 * @param { apps - 应用列表 }
 * @return { app - 需要被加载的应用 }
 */
export function getAppShouldBeActive(apps: Array<Project>): Project[] {
  return apps.filter(getAppMountTime)
}

export function registerEvents(global: GlobalType) {
  if (!global.$event) { return }
  global.$event.subscribe('baseInfoLoaded', baseInfoLoaded);
  global.$event.subscribe('childAppLoaded', childAppLoaded);
}


export function getAppMountTime(app: Project) {
  try {
    return app.activeWhen(window.location);
  } catch (e) {
    throw e;
  }
}

export function firstUpperCase(str: string) {
  return str.toLowerCase().replace(/(|^)[a-z]/g, (L) => L.toUpperCase());
}

function baseInfoLoaded(data: any) {
  globalContext.activeAppInfo = data
  return data
}

function childAppLoaded(data: any) {
  debugger
  globalContext.activedApplication = data
  return data
}
