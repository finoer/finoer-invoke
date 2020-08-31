import { Project, BaseProject } from "../project";
import { Apps } from "../applycation/register";
import { getStore, setStore } from "../applycation/store";
import { getAppShouldBeActive, registerEvents } from "../utils";
import { GlobalType, ContextType } from '../types/context'
import Events from "../events";
import { tagLoadJs } from "../loader";
import { globalContext } from "../global";
import initRuntimeContext from "../context/init";
import VueRuntimeContext from "../context/vue";
import { BOOTSTRAP, MOUNTED, MOUNT } from "../utils/contants";


enum LifeCircle {
  BOOTSTRAP = 'bootstrap',
  MOUNTED = 'mount'
}

class Invoke {
  // Operating environment: whether to run on the base or the sub-module to run independently
  public runtimeInfino: boolean = true;
  // Application List
  public appList: Array<Project> = [];
  // Run submodule: the first one by default
  public app: Project = Apps[0];
  // Event
  public $event: Events;

  constructor() {
    const global: GlobalType = window

    this.$event = global.$event = new Events();

    registerEvents(global)
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

    this.app = activeApp.app

    // Trigger loading animation
    this.$event.notify('appLeave')

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

    let activeProject: Project['appInfo'];

    const entryStatePath = this.app.domain + this.app.entry;

    // Get application js packaging information
    activeProject = await this.getEntryJs(entryStatePath)

    if(!activeProject) {
      return
    }

    // load application entry file { init: () => {}, name: string, destory: () => {} }
    globalContext.activedApplication = await this.getModuleJs(this.app.domain, globalContext.activeAppInfo);

    // Execute mount life cycle
    await this.mount()
  }

  /**
   * @methods { life cycle-mount }
   * @des Create a running environment and inject routing
   */
  async mount() {
    // Get current application information
    const activeProject = this.app
    // Create the runtime context
    let runtime: ContextType['context'] = globalContext.activeContext;

    // If the runtime context of the new application is different from the previous one, uninstall it
    if(activeProject.context !== globalContext.activeAppInfo.context) {

      activeProject.context &&
      Object.assign(globalContext.activeAppInfo, {
        context: activeProject.context, version: activeProject.version
      })

      // uninstall before app runtime context,
      runtime && runtime.destroy && runtime.destroy()

      // store the created runtime environment in the global
      runtime = globalContext.activeContext = await initRuntimeContext(globalContext.activeAppInfo.context, globalContext.activeAppInfo.version);
    }else {

      // If the runtime context is the same, reuse directly
      runtime = globalContext.activeContext
    }

    // The runtime context is initialized successfully, and the route is injected
    if(this.app.status === MOUNT || this.app.name === globalContext.activedApplication.name)  {
      if(this.app.status === MOUNT) {
        globalContext.activedApplication = this.app
      }
      // injection router
      globalContext.activedApplication.init && globalContext.activedApplication.init((runtime as VueRuntimeContext), globalContext.activeContext)
    }

    this.app.status = MOUNT

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
    if(typeof(assetsData.app) === 'string') {
      await this.getEntryJs(baseDomain + '/' + assetsData.app)
    }else {
      await this.getEntryJs(baseDomain + '/' + assetsData.app[0])
    }

    return globalContext.activedApplication

    /**
     * @remark for mutile entry

    for(let i = 0; i < assetsData.app.length; i++) {
      await this.getEntryJs(baseDomain + '/' + assetsData.app[i])

      return globalContext.activedApplication
    }


    return globalContext.activedApplication
    */
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
