import BaseModuleContext from "./base";

import { CreateElement } from "vue/types/umd";
import { globalContext } from "../global";

interface Global extends Window {
  vue?: Vue,
  VueRouter?: any,
}

class VueRuntimeContext extends BaseModuleContext {
  // 当前runtime
  public instance?: Vue

  constructor() {
    super("vue")
  }

  /**
   * @func 获取资源
   * @param version
   */
  async getContextResource(version: string) {
    if(globalContext.contextSourceCache.vue) {
      return
    }
    // 获取当前运行环境所需的资源
    const context = await this.getSandBoxJs('vue', version)
    const routerLib = await this.getSandBoxJs('vue-router', '3.4.3')

    globalContext.contextSourceCache.vue = true
    globalContext.contextSourceCache.vueRouter = true

    return context
  }

  /**
   * @func {*} 初始化vue运行环境
   */
  createContext(version: string) {
    // 创建插入节点
    let rootDom = document.createElement('div');
    rootDom.setAttribute('id', 'root');
    document.body.appendChild(rootDom)

    const Vue = window.Vue;
    const VueRouter = (window as any).VueRouter

    Vue.use(VueRouter)
    const router = new VueRouter({
      mode: 'history',
      routes: []
    })

    const vue = (window as any).vm = new (Vue as any)({
      el: rootDom,
      router,
      render: (h: CreateElement) => h('div', { attrs: { id: 'root' } },
        [
          h('RouterView')
        ]
      )
    })

    return vue
  }

  /**
   * @func 注入路由
   */
  injectionRouter(routes: Array<any>) {
    if(!this.instance) {
      return
    }

    (this as any).instance.$router.addRoutes(routes);

    (this as any).instance.$router.options.routes = routes

    // this.instance.$router.push('/about')
  }

  /**
   * @func 卸载运行环境
   */
  destroy() {
    this.instance && this.instance.$destroy()
    const element = document.getElementById('root')
    element && document.body.removeChild(element)
  }
}

export default VueRuntimeContext
