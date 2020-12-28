// import apps from '../model/index'
import { globalContext } from "../global";
import { BOOTSTRAP, MOUNT, UNMOUNT } from "./contants";
/**
 * @function 获取当前应该被加载的应用
 * @param { apps - 应用列表 }
 * @return { app - 需要被加载的应用 }
 */
export function getAppShouldBeActive(apps) {
    let result = { app: apps[0], index: 0 };
    apps.forEach((item, index) => {
        if (item.activeWhen(window.location) && item.status) {
            item.status === UNMOUNT && (item.status = BOOTSTRAP);
            result = {
                app: item,
                index: index
            };
        }
    });
    return result;
}
/**
 * @function 获取当前应该被卸载的应用
 * @param global
 * @param { apps - 应用列表 }
 * @return { app - 需要被加载的应用 }
 */
export function getAppShouldBeUnmount(apps) {
    let result = [];
    apps.forEach((item, index) => {
        if (!item.activeWhen(window.location) && item.status === MOUNT) {
            result.push({
                app: item,
                index: index
            });
        }
    });
    return result;
}
// 判断是否是一个对象
export const isObject = (obj) => typeof (obj) === 'object' && obj !== null;
/**
 * @func 进入loading模式
 * @parans { show - 是否展示loading }
 */
// 卸载标签
export function removeChild(id) {
    let element = document.getElementById(id);
    element && document.body.removeChild(element);
}
export function registerEvents(global) {
    if (!global.$event) {
        return;
    }
    global.$event.subscribe('baseInfoLoaded', baseInfoLoaded);
    global.$event.subscribe('childAppLoaded', childAppLoaded);
}
export function getAppMountTime(app) {
    try {
        return app.activeWhen(window.location);
    }
    catch (e) {
        throw e;
    }
}
export function firstUpperCase(str) {
    return str.toLowerCase().replace(/(|^)[a-z]/g, (L) => L.toUpperCase());
}
function baseInfoLoaded(data) {
    globalContext.activeAppInfo = data;
    return data;
}
function childAppLoaded(data) {
    globalContext.activedApplication = data;
    return data;
}
//# sourceMappingURL=index.js.map