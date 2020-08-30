import { Apps } from '../applycation/register';
/**
 * @class 全局单例
 */
export class GlobalContext {
    constructor() {
        // 当前需要加载的子模块
        this.activeAppInfo = {
            app: '',
            context: '',
            version: ''
        };
        // 资源缓存
        this.contextSourceCache = {};
        this.activedApplication = Apps[0];
        this.activeContext = Window;
    }
    // 设置运行环境
    setRuntimeContext(context) {
        this.activeContext = context;
    }
}
function getGlobalContext() {
    const global = window;
    if (global.globalContext) {
        return global.globalContext;
    }
    global.globalContext = new GlobalContext();
    return global.globalContext;
}
export const globalContext = getGlobalContext();
//# sourceMappingURL=index.js.map