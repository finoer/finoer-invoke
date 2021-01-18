import { Project, BaseProject } from "../types/project";
import { Apps } from "../applycation/register";
import { getStore, setStore } from "../applycation/store";
import { getAppShouldBeActive, getAppShouldBeUnmount, registerEvents, removeChild } from "../utils";
import { GlobalType, ContextType, MatchAppType } from '../types/context'
import Events from "../events";
import { tagLoadJs, tagLoadCss } from "../loader";
import { globalContext } from "../global";
import initRuntimeContext from "../context/init";
import VueRuntimeContext from "../context/vue";
import { BOOTSTRAP, MOUNTED, MOUNT, UNMOUNT } from "../utils/contants";
import SnapshotSandbox from "../sandbox/snapshot";
import { patchInterval } from "../sandbox/patchAtMounting";

enum LifeCircle {
  BOOTSTRAP = 'bootstrap',
  MOUNTED = 'mount'
}

const global: GlobalType = window

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

    this.performAppChnage(this.appList)

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

    // uninstall apps that do not require activation
    const unmountApps = getAppShouldBeUnmount(apps);

    // restore the sandbox environment
    if(!isFrist) {
      this.free()
    }

    isFrist = false
    if(unmountApps) {
      await this.unmount(unmountApps)
    }

    this.app = activeApp.app

    global.$data && global.$data.init(this.app.name)

    if(this.app.status === MOUNT) {
      globalContext.activedApplication = this.app
    }

    // Trigger loading animation
    if(!this.app.init) {
      this.$event.notify('appLeave')
    }

    globalContext.activeContext = await this.setRuntimeContext(this.app);

    // Get the life cycle function of the current application(bootstrap, mount)
    const lifecircle = this.app.status.toLocaleLowerCase();

    await this[(lifecircle as LifeCircle)]()

    // At this time, the various information of the app is ready, merge the cached information to the current app
    this.app = Object.assign(this.app, globalContext.activeAppInfo,  globalContext.activedApplication)

    Apps[activeApp.index] = this.app

    this.$event.notify('appEnter')
  }

  /**
   * @methods { life cycle-bootstrap }
   */
  async bootstrap() {

    // globalContext.activeAppInfo.context && this.sandbox.inactive()
    // Get current application information
    let activeProject: Project['appInfo'];

    const entryStatePath = this.app.domain + this.app.entry;

    // Get application js packaging information
    activeProject = await this.getEntryJs(entryStatePath)

    if(!this.sandbox.appCache.includes(this.app.name)) {
      this.sandbox.name = this.app.name
      this.sandbox.active()
    }

    // load application entry file { init: () => {}, name: string, destory: () => {} }
    globalContext.activedApplication = await this.getModuleJs(this.app.domain, globalContext.activeAppInfo);

    removeChild(this.app.domain + this.app.entry)
    // Execute mount life cycle
    await this.mount()
  }

  /**
   * @methods The application is successfully mounted, and the sub-application is notified
   */
  public async setRuntimeContext(activeProject: Project['appInfo']): Promise<ContextType['context']> {
    if(!activeProject) {
      return globalContext.activeContext
    }

    // Create the runtime context
    let runtime: ContextType['context'] = globalContext.activeContext;

    // If the runtime context of the new application is different from the previous one, uninstall it
    if(!this.app.context || this.app.context !== globalContext.activeContext.context) {

      activeProject.context &&
      Object.assign(globalContext.activeAppInfo, {
        context: activeProject.context, version: activeProject.version
      })

      // uninstall before app runtime context,
      if(runtime && runtime.destroy) {
        runtime.destroy()

      }

      // store the created runtime environment in the global
      runtime = globalContext.activeContext = await initRuntimeContext(globalContext.activeAppInfo.context, globalContext.activeAppInfo.version);
    }else {

      // If the runtime context is the same, reuse directly
      runtime = globalContext.activeContext
    }

    return runtime
  }

  /**
   * @methods { life cycle-mount }
   * @des Create a running environment and inject routing
   */
  async mount() {
    const runtime = globalContext.activeContext
    // The runtime context is initialized successfully, and the route is injected

    if(this.app.status === MOUNT) {
      globalContext.activedApplication = this.app
      this.sandbox.name = this.app.name
      this.sandbox.active()
    }

    if(this.app.name === globalContext.activedApplication.name)  {
      // injection router
      globalContext.activedApplication.init && globalContext.activedApplication.init((runtime as VueRuntimeContext), globalContext.activeContext)
    }

    this.app.status = MOUNT

  }

  /**
   * @methods { life cycle-unmount }
   * @des
   */
  async unmount(apps: MatchAppType[]) {
    return new Promise<void>((resolve) => {
      if(!apps) { resolve() }
      // resolve()

      for(let i = 0; i < apps.length; i++) {
        // 卸载应用标签
        for(let j = 0; j < apps[i].app.dynamicElements.length; j++) {
          // removeChild(apps[i].app.dynamicElements[j])
        }

        // apps[i].app.dynamicElements = []
        // 将状态设置位UNMOUNT
        // apps[i].app.status = UNMOUNT;
      }

      this.sandbox.inactive()

      resolve()
    })
  }

  /**
   * @methods The application is successfully mounted, and the sub-application is notified
   */
  public mounted() {

  }

  /**
   * @methods Get application js
   */
  async getModuleJs(baseDomain: string, assetsData: any): Promise<Project> {
    // const assets = Object.keys(assetsData);
    for(let i = 0; i < assetsData.length; i++) {

      if(typeof(assetsData[i]) === 'string') {
        let entry = assetsData[i]
        if(entry.indexOf('.css') > -1) {
          tagLoadCss(baseDomain + '/' + entry)
        }else if(entry.indexOf('.js') > -1){
          await this.getEntryJs(baseDomain + '/' + entry)
        }else {
          let source = new Image()
          source.src = baseDomain + '/' + entry
        }

        this.app.dynamicElements ? (this.app.dynamicElements as Array<string>).push(baseDomain + '/' + assetsData.app)
        : this.app.dynamicElements = [baseDomain + '/' + assetsData.app]
        continue
      }
    }

    return globalContext.activedApplication
  }


   /**
   * @methods jsonp loads js files
   * @param { url - url }
   */
  public getEntryJs(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      tagLoadJs(url).then(() => {
        // 加载完成的内容会挂载到这个globalContext上
        resolve(globalContext.activeAppInfo)
      }).catch(e => {
        reject(e)
      })
    })
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
  }
}

export default Invoke
