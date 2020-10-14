import { Project } from "../project";
// import apps from '../model/index'
import { globalContext } from "../global";
import { GlobalType, MatchAppType } from "../types/context";
import { BOOTSTRAP, MOUNT, UNMOUNT } from "./contants";


/**
 * @function 获取当前应该被加载的应用
 * @param { apps - 应用列表 }
 * @return { app - 需要被加载的应用 }
 */
export function getAppShouldBeActive(apps: Array<Project>): MatchAppType {
  let result: MatchAppType = { app: apps[0], index: 0 };
  apps.forEach((item, index) => {
    if (item.activeWhen(window.location) && item.status ) {
      item.status === UNMOUNT && (item.status = BOOTSTRAP);
      result = {
        app: item,
        index: index
      }
    }
  })
  return result
}

/**
 * @function 获取当前应该被卸载的应用
 * @param global
 * @param { apps - 应用列表 }
 * @return { app - 需要被加载的应用 }
 */
export function getAppShouldBeUnmount(apps: Array<Project>): Array<MatchAppType> {
  let result: MatchAppType[] = [];

  apps.forEach((item, index) => {
    if (!item.activeWhen(window.location) && item.status === MOUNT) {
      result.push({
        app: item,
        index: index
      })
    }
  })
  return result
}



/**
 * @func 进入loading模式
 * @parans { show - 是否展示loading }
 */
// export function triggerLoading() {
//   const wrapper = document.createElement('div');
//   const style = `background: #000;width:100%; height:100%; position: fixed;`
//   wrapper.setAttribute('style', style)

//   // 创建loading
//   const loading = `<img src="../static/loading.svg"/>`
//   wrapper.innerHTML = loading;

//   document.body.appendChild(wrapper)
// }

// 卸载标签
export function removeChild(id: string) {
  let element = document.getElementById(id);
  element && document.body.removeChild(element);
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
  globalContext.activedApplication = data
  return data
}

// function appEnter(app: Project, callBack: any) {
//   console.log(`app1----enter: ${app}`)
//   callBack && callBack();
// }
