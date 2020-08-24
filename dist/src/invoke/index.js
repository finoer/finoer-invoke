import { Apps } from "../applycation/register";
import { getStore, setStore } from "../applycation/store";
import { getAppShouldBeActive, registerEvents } from "../utils";
import Events from "../events";
import { tagLoadJs } from "../loader";
import { globalContext } from "../global";
import initRuntimeContext from "../context/init";
class Invoke {
    constructor() {
        // 运行环境：基座还是子模块独立运行
        this.runtimeInfino = true;
        // 运行子模块：默认第一个
        this.app = Apps[0];
        const global = window;
        this.$event = global.$event = new Events();
        registerEvents(global);
    }
    /**
     * @methods { 调度app模块 }
     * @desc
     * @params { - apps: 子模块列表 }
     */
    async performAppChnage(apps) {
        debugger;
        // 获取需要被挂载的应用
        this.app = getAppShouldBeActive(apps)[0] || Apps[0];
        // 获取应用项目基本信息， 包括js地址什么的
        const entryStatePath = this.app.domain + this.app.entry;
        const activeProject = await this.getEntryJs(entryStatePath);
        if (!activeProject) {
            return;
        }
        // 加载入口文件
        globalContext.activedApplication = await this.getModuleJs(activeProject);
        debugger;
        // 创建运行环境
        let runtime;
        if (activeProject.context !== globalContext.activeContext.context) {
            runtime = globalContext.activeContext = await initRuntimeContext(activeProject.context, activeProject.version);
            Object.assign(globalContext.activeContext, activeProject);
        }
        else {
            runtime = globalContext.activeContext;
        }
        // 环境初始化成功， 开始注入路由
        if (this.app.name === globalContext.activedApplication.name) {
            // 注入路由
            globalContext.activedApplication.init && globalContext.activedApplication.init(runtime);
        }
        this.app = Object.assign(this.app, activeProject, globalContext.activedApplication);
        this.app.status = "MOUNTED";
        console.log('activeProject', this.app);
    }
    /**
     * @function getModuleJs
     */
    async getModuleJs(assetsData) {
        debugger;
        if (typeof (assetsData.app) === 'string') {
            await this.getEntryJs(this.app.domain + '/' + assetsData.app);
            return globalContext.activedApplication;
        }
        for (let i = 0; i < assetsData.app.length; i++) {
            await this.getEntryJs(this.app.domain + '/' + assetsData.app[i]);
            return globalContext.activedApplication;
        }
        return globalContext.activedApplication;
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