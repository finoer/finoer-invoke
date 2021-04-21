import { Project, BaseProject } from "../types/project";
import { Apps } from "../applycation/register";
import { getStore, setStore } from "../applycation/store";
import { getAppShouldBeActive, getAppShouldBeUnmount, preloadSource, registerEvents, removeChild } from "../utils";
import { GlobalType, ContextType, MatchAppType } from '../types/context'
import Events from "../events";
import { getEntryJs, tagLoadCss } from "../loader";
import { globalContext } from "../global";
import initRuntimeContext from "../context/init";
import { BOOTSTRAP, MOUNT } from "../utils/contants";
import SnapshotSandbox from "../sandbox/snapshot";
import { patchInterval } from "../sandbox/patchAtMounting";
import { bootstrap, mount, unmount, bootstraping } from './lifecircle'
import axios from 'axios'

enum LifeCircle {
    BOOTSTRAP = 'bootstrap',
    MOUNTED = 'mount'
}

const global: GlobalType = window

const lifecircleFn = { bootstrap, mount, bootstraping }

let isFrist = true

class Invoke {
    // Operating environment: whether to run on the base or the sub-module to run independently
    public runtimeInfino: boolean = true;
    // Application List
    public appList: Array<Project> = [];
    // Run submodule: the first one by default
    public app: Project = Apps[0];
    // Event
    public $event: Events;
    // mode: safe or speed
    public mode: string = 'speed'
    // sandbox
    public sandbox: SnapshotSandbox
    // interval
    public free: any

    constructor() {
        const global: GlobalType = window

        this.$event = global.$event = new Events();
        this.sandbox = new SnapshotSandbox('')

        registerEvents(global)

        this.free = patchInterval(window)
    }

    /**
     * @methods { Initialize the project list }
     * @param apps { project list as array }
     */
    public init(apps: Array<BaseProject>) {
        apps.map((item, index) => {
            item.status = BOOTSTRAP
        })

        this.appList = (apps as Project[])

        return this.appList
    }

    /**
     * @methods { Scheduling applications, uninstalling the runtime, and mounting new applications }
     * @desc
     * @params { - apps: Project child project list }
     */
    async performAppChnage(apps: Array<Project>) {

        // Get the application that needs to be mounted
        const activeApp = getAppShouldBeActive(apps);

        if (!activeApp) {
            throw new Error('没有需要挂载的应用');
            return
        }

        this.app = activeApp.app
        this.app.dynamicElements = this.app.dynamicElements || { js: [], css: [] }

        // uninstall apps that do not require activation
        const unmountApps = getAppShouldBeUnmount(apps);

        // restore the sandbox environment
        if (!isFrist) {
            this.free()
        }

        isFrist = false
        if (unmountApps) {
            await unmount(unmountApps, this.sandbox, this.mode)
        }

        if (this.app.status === MOUNT) {
            globalContext.activedApplication = this.app
        }

        // Trigger loading animation
        if (!this.app.init) {
            this.$event.notify('appLeave')
        }

        globalContext.activeContext = await this.setRuntimeContext(this.app);

        // Get the life cycle function of the current application(bootstrap, mount)
        const lifecircle = this.app.status.toLocaleLowerCase();

        this.app = await lifecircleFn[(lifecircle as LifeCircle)](this.app, this.sandbox, this.getModuleJs.bind(this))

        // At this time, the various information of the app is ready, merge the cached information to the current app
        this.app = Object.assign(this.app, globalContext.activeAppInfo, globalContext.activedApplication)

        Apps[activeApp.index] = this.app

        this.$event.notify('appEnter')
    }


    /**
     * @methods The application is successfully mounted, and the sub-application is notified
     */
    public async setRuntimeContext(activeProject: Project['appInfo']): Promise<ContextType['context']> {
        if (!activeProject) {
            return globalContext.activeContext
        }

        // Create the runtime context
        let runtime: ContextType['context'] = globalContext.activeContext;

        // If the runtime context of the new application is different from the previous one, uninstall it
        if (!this.app.context || this.app.context !== globalContext.activeContext.context) {

            activeProject.context &&
                Object.assign(globalContext.activeAppInfo, {
                    context: activeProject.context, version: activeProject.version
                })

            // uninstall before app runtime context,
            if (runtime && runtime.destroy) {
                runtime.destroy()
            }

            // store the created runtime environment in the global
            runtime = globalContext.activeContext = await initRuntimeContext(globalContext.activeAppInfo.context, globalContext.activeAppInfo.version);
        } else {

            // If the runtime context is the same, reuse directly
            runtime = globalContext.activeContext
        }

        return runtime
    }

    /**
     * @methods Get application js
     */
    async getModuleJs(baseDomain: string, assetsData: any): Promise<Project> {
        const entryStatePath = this.app.entry.indexOf('http') > -1 ? this.app.entry : this.app.domain + this.app.entry;
        // const assets = Object.keys(assetsData);
        for (let i = 0; i < assetsData.length; i++) {
            if (typeof (assetsData[i]) === 'string') {
                const entry = assetsData[i]
                const url = baseDomain + '/' + entry

                if (entry.indexOf('.css') > -1) {
                    !document.getElementById(url) && tagLoadCss(url)
                    this.app.dynamicElements.css.indexOf(url) === -1 &&
                        this.app.dynamicElements.css.push(url)
                    continue
                } else if (entry.indexOf('.js') > -1) {
                    await getEntryJs(url)
                } else {

                    axios.get(url)
                }

                if (this.mode === 'safe') {
                    this.app.dynamicElements.js.push(url)
                }

                continue
            }
        }

        this.app.dynamicElements.js.push(entryStatePath)


        return globalContext.activedApplication
    }

    /**
     * @methods { runtimeInFino }
     * @desc { 确定当前是否在基座运行 }
     */
    public isInFinoRuntime() {
        return !!getStore('root');
    }

    public start() {
        setStore('root', 'root')

        this.performAppChnage(this.appList)
    }

    public async preload() {
        for (let app of this.appList) {
            let activeInfo: Project['appInfo'];

            const entryStatePath = app.entry.indexOf('http') > -1 ? app.entry : app.domain + app.entry;

            // Get application js packaging information
            activeInfo = await getEntryJs(entryStatePath);

            // preload application files
            preloadSource(app.domain, activeInfo);


        }
    }
}

export default Invoke
