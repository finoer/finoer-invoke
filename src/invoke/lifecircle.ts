import { invoke } from "..";
import VueRuntimeContext from "../context/vue";
import { globalContext } from "../global";
import { getEntryJs, loadCss } from "../loader";
import SnapshotSandbox from "../sandbox/snapshot";
import { MatchAppType } from "../types/context";
import { Project } from "../types/project";
import { removeChild } from "../utils";
import { MOUNT, UNMOUNT } from "../utils/contants";

/**
 * @methods { life cycle-bootstrap }
 */
export async function bootstrap(app: Project, sandbox: SnapshotSandbox, loadFn: (baseDomain: string, assetsData: any) => Promise<Project>) {
    app.status = "bootstraping"
    let activeProject: Project['appInfo'];

    const entryStatePath = app.entry.indexOf('http') > -1 ? app.entry : app.domain + app.entry;

    // Get application js packaging information
    activeProject = await getEntryJs(entryStatePath);

    // activate the sandbox
    if (!sandbox.appCache.includes(app.name)) {
        sandbox.name = app.name
        sandbox.active()
    }

    // load application entry file { init: () => {}, name: string, destory: () => {} }
    globalContext.activedApplication = await loadFn(app.domain, globalContext.activeAppInfo);

    removeChild(app.domain + app.entry);

    // Execute mount life cycle
    return mount(app, sandbox)
}

/**
 * @methods { life cycle-mount }
 * @des Create a running environment and inject routing
 */
export async function mount(app: Project, sandbox: SnapshotSandbox,) {
    const runtime = globalContext.activeContext

    // The runtime context is initialized successfully, and the route is injected
    if (app.status === MOUNT) {
        globalContext.activedApplication = app
        sandbox.name = app.name
        sandbox.active()
    }

    // app.dynamicElements.css && (await loadCss(app.dynamicElements.css))

    if (app.name === globalContext.activedApplication.name) {
        // injection router
        globalContext.activedApplication.init && globalContext.activedApplication.init((runtime as VueRuntimeContext), globalContext.activeContext)
    }

    app.status = MOUNT

    invoke.$event.notify('appMount')


    return app
}

/**
 * @methods { life cycle-unmount }
 * @des
*/
export async function unmount(apps: MatchAppType[], sandbox: SnapshotSandbox, mode: string) {
    return new Promise<void>((resolve) => {
        if (!apps) { resolve() }
        // resolve()

        for (let i = 0; i < apps.length; i++) {
            if (!apps[i].app.dynamicElements.js) continue
            // 卸载应用标签
            for (let j = 0; j < apps[i].app.dynamicElements.js.length; j++) {
                removeChild(apps[i].app.dynamicElements.js[j])
            }

            // for(let j = 0; j < apps[i].app.dynamicElements.css.length; j++) {
            //   removeChild(apps[i].app.dynamicElements.css[j])
            // }

            if (mode === 'safe') {
                apps[i].app.dynamicElements.js = []
                // 将状态设置位UNMOUNT
                apps[i].app.status = UNMOUNT;
            }

        }

        sandbox.inactive()

        resolve()
    })
}

/**
 * @methods The application is successfully mounted, and the sub-application is notified
 */
export async function mounted() {

}

export async function bootstraping(app: Project) {
    return app
}
