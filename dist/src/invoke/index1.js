import { getAppShouldBeActive } from "../utils";
import { PEDEST_NOT_STARTED } from "../utils/contants";
import { tagLoadJs } from "../loader";
import { globalContext } from "../global/index";
import initRuntimeContext from "../context/init";
import { Apps } from "../applycation/register";
class Invoke {
    constructor() {
        // pedestal status
        this.pedestalStatus = PEDEST_NOT_STARTED;
        // 激活的app
        this.app = Apps[0];
    }
    /**
     * @function 获取js加载地址
     * @param { url - 应用地址 }
     */
    getEntryJs(url) {
        return new Promise((resolve, reject) => {
            tagLoadJs(url).then(() => {
                resolve(globalContext.activeAppInfo);
            }).catch(e => {
                reject(e);
            });
        });
    }
    /**
     * @function registerApp
     * @param apps
     */
    async performAppChange(apps) {
        // 获取需要被挂在的应用
        let app = this.app = getAppShouldBeActive(apps)[0];
        if (!app) {
            console.error('当前路由匹配到了多个app, 默认使用第一个');
            return;
        }
        // 获取当前应用的项目信息
        const entryPathState = app.domain + app.entry;
        const activeProject = await this.getEntryJs(entryPathState);
        // 加载项目js
        if (activeProject.data) {
            const entryJs = this.getEntryJsPath(activeProject.data.assetsByChunkName);
        }
        const context = activeProject.appInfo && activeProject.appInfo.context || 'vue';
        const runtime = initRuntimeContext(context, '2.6.5');
        // 环境初始化成功， 调用子模块生命周期进行挂载
        if (app.name === globalContext.activedApplication.name) {
            // 注入路由
            // globalContext.activedApplication.init && globalContext.activedApplication.init(runtime)
        }
    }
    /**
     * @function
     */
    async getEntryJsPath(assetsData) {
        if (typeof (assetsData.app) === 'string') {
            return this.app.domain + assetsData.app;
        }
        for (let i = 0; i < assetsData.app.length; i++) {
            await this.getEntryJs(this.app.domain + '/' + assetsData.app[i]);
        }
    }
}
export default Invoke;
//# sourceMappingURL=index1.js.map