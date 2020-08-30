import BaseModuleContext from "./base";
import { globalContext } from "../global";
class VueRuntimeContext extends BaseModuleContext {
    constructor() {
        super("vue");
    }
    /**
     * @func 获取资源
     * @param version
     */
    async getContextResource(version) {
        if (globalContext.contextSourceCache.vue) {
            return;
        }
        // 获取当前运行环境所需的资源
        const context = await this.getSandBoxJs('vue', version);
        const routerLib = await this.getSandBoxJs('vue-router', '3.4.3');
        globalContext.contextSourceCache.vue = true;
        globalContext.contextSourceCache.vueRouter = true;
        return context;
    }
    /**
     * @func {*} 初始化vue运行环境
     */
    createContext(version) {
        // 创建插入节点
        let rootDom = document.createElement('div');
        rootDom.setAttribute('id', 'root');
        document.body.appendChild(rootDom);
        const Vue = window.Vue;
        const VueRouter = window.VueRouter;
        Vue.use(VueRouter);
        const router = new VueRouter({
            mode: 'history',
            routes: []
        });
        const vue = window.vm = new Vue({
            el: rootDom,
            router,
            render: (h) => h('div', { attrs: { id: 'root' } }, [
                h('RouterView')
            ])
        });
        return vue;
    }
    /**
     * @func 注入路由
     */
    injectionRouter(routes) {
        if (!this.instance) {
            return;
        }
        this.instance.$router.addRoutes(routes);
        this.instance.$router.options.routes = routes;
        // this.instance.$router.push('/about')
    }
    /**
     * @func 卸载运行环境
     */
    destroy() {
        this.instance && this.instance.$destroy();
        const element = document.getElementById('root');
        element && document.body.removeChild(element);
    }
}
export default VueRuntimeContext;
//# sourceMappingURL=vue.js.map