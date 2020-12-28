import BaseModuleContext from "./base";
import { globalContext } from "../global";
class VueRuntimeContext extends BaseModuleContext {
    constructor() {
        super("vue");
    }
    /**
     * @func { Get running environment resources }
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
     * @func {*} create vue runtime context
     */
    createContext(version) {
        // create root node
        let rootDom = document.createElement('div');
        rootDom.setAttribute('id', 'fino-vue-root');
        document.body.appendChild(rootDom);
        window['Vue2'] = window['Vue'];
        window['Vue'] = undefined;
        const Vue = window['Vue2'];
        const VueRouter = window.VueRouter;
        Vue.use(VueRouter);
        const router = new VueRouter({
            mode: 'history',
            routes: []
        });
        const vue = window.vm = new Vue({
            el: rootDom,
            router,
            render: (h) => h('div', { attrs: { id: 'fino-vue-root' } }, [
                h('RouterView')
            ])
        });
        return vue;
    }
    /**
     * @func { Injection router }
     */
    injectionRouter(routes) {
        if (!this.instance) {
            return;
        }
        this.instance.$router.addRoutes(routes);
        this.instance.$router.options.routes = routes;
    }
    /**
     * @func { Uninstall the runtime environment }
     */
    destroy() {
        this.instance && this.instance.$destroy();
        const element = document.getElementById('fino-vue-root');
        element && document.body.removeChild(element);
    }
}
export default VueRuntimeContext;
//# sourceMappingURL=vue.js.map