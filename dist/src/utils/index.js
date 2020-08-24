// import apps from '../model/index'
import { globalContext } from "../global";
/**
 * @function 获取当前应该被加载的应用
 * @param { apps - 应用列表 }
 * @return { app - 需要被加载的应用 }
 */
export function getAppShouldBeActive(apps) {
    return apps.filter(getAppMountTime);
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
    debugger;
    globalContext.activedApplication = data;
    return data;
}
//# sourceMappingURL=index.js.map