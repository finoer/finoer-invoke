import { Apps } from "../applycation/register";
import { getStore, setStore } from "../applycation/store";
import { getAppShouldBeActive, registerEvents } from "../utils";
import Events from "../events";
import { tagLoadJs } from "../loader";
import { globalContext } from "../global";
import initRuntimeContext from "../context/init";
import { BOOTSTRAP, MOUNT } from "../utils/contants";
var LifeCircle;
(function (LifeCircle) {
    LifeCircle["BOOTSTRAP"] = "bootstrap";
    LifeCircle["MOUNTED"] = "mount";
})(LifeCircle || (LifeCircle = {}));
class Invoke {
    constructor() {
        // 运行环境：基座还是子模块独立运行
        this.runtimeInfino = true;
        // 子模块列表
        this.appList = [];
        // 运行子模块：默认第一个
        this.app = Apps[0];
        const global = window;
        this.$event = global.$event = new Events();
        registerEvents(global);
    }
    /**
     * @methods { 初始化项目列表 }
     * @param apps
     */
    init(apps) {
        apps.map((item, index) => {
            item.status = BOOTSTRAP;
        });
        this.appList = apps;
        this.performAppChnage(this.appList);
        return this.appList;
    }
    /**
     * @methods { 调度app模块 }
     * @desc
     * @params { - apps: 子模块列表 }
     */
    async performAppChnage(apps) {
        // 获取需要被挂载的应用
        const activeApp = getAppShouldBeActive(apps);
        this.app = activeApp.app;
        // 触发app进入的loading
        this.$event.notify('appLeave');
        // 获取当前应用的生命周期函数 bootstrap, mount
        const lifecircle = this.app.status.toLocaleLowerCase();
        await this[lifecircle]();
        // 此时app的各种信息已经就绪， 合并缓存的信息到当前的app上，
        this.app = Object.assign(this.app, globalContext.activeAppInfo, globalContext.activedApplication);
        Apps[activeApp.index] = this.app;
        this.$event.notify('appEnter');
    }
    /**
     * @methods { bootstrap生命周期函数 }
     */
    async bootstrap() {
        let activeProject;
        const entryStatePath = this.app.domain + this.app.entry;
        activeProject = await this.getEntryJs(entryStatePath);
        // 获取基础js
        if (!activeProject) {
            return;
        }
        // 加载入口文件 { init: () => {}, name: string, destory: () => {} }
        globalContext.activedApplication = await this.getModuleJs(this.app.domain, globalContext.activeAppInfo);
        // 执行mount生命周期
        await this.mount();
    }
    /**
     * @methods { mount生命周期函数 }
     * @des 创建运行环境， 注入路由
     */
    async mount() {
        // 当前应用信息
        const activeProject = this.app;
        // 创建运行环境
        let runtime = globalContext.activeContext;
        if (activeProject.context !== globalContext.activeAppInfo.context) {
            // 如果
            activeProject.context &&
                Object.assign(globalContext.activeAppInfo, {
                    context: activeProject.context, version: activeProject.version
                });
            // 卸载之前的运行环境
            runtime && runtime.destroy && runtime.destroy();
            runtime = globalContext.activeContext = await initRuntimeContext(globalContext.activeAppInfo.context, globalContext.activeAppInfo.version);
            // 将创建出来的运行环境存储到全局
        }
        else {
            runtime = globalContext.activeContext;
        }
        // 环境初始化成功， 开始注入路由
        if (this.app.status === MOUNT || this.app.name === globalContext.activedApplication.name) {
            if (this.app.status === MOUNT) {
                globalContext.activedApplication = this.app;
            }
            // 注入路由
            globalContext.activedApplication.init && globalContext.activedApplication.init(runtime, globalContext.activeContext);
        }
        this.app.status = MOUNT;
    }
    mounted() {
    }
    /**
     * @function getModuleJs
     */
    async getModuleJs(baseDomain, assetsData) {
        if (typeof (assetsData.app) === 'string') {
            await this.getEntryJs(baseDomain + '/' + assetsData.app);
        }
        else {
            await this.getEntryJs(baseDomain + '/' + assetsData.app[0]);
        }
        return globalContext.activedApplication;
        /**
         * @remark 多入口js，
    
        for(let i = 0; i < assetsData.app.length; i++) {
          await this.getEntryJs(baseDomain + '/' + assetsData.app[i])
    
          return globalContext.activedApplication
        }
    
    
        return globalContext.activedApplication
        */
    }
    /**
    * @function 获取js加载地址
    * @param { url - 应用地址 }
    */
    getEntryJs(url) {
        return new Promise((resolve, reject) => {
            tagLoadJs(url).then(() => {
                // 加载完成的内容会挂载到这个globalContext上
                resolve(globalContext.activeAppInfo);
            }).catch(e => {
                reject(e);
            });
        });
    }
    /**
     * @methods { runtimeInFino }
     * @desc { 确定当前是否在基座运行 }
     */
    isInFinoRuntime() {
        return !!getStore('root');
    }
    start() {
        setStore('root', 'root');
    }
}
export default Invoke;
//# sourceMappingURL=index.js.map