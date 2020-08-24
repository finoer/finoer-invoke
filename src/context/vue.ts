import BaseModuleContext from "./base";
import Router, { RouteConfig } from 'vue-router'
import { CreateElement } from "vue/types/umd";

interface Global extends Window {
  vue?: Vue
}

class VueRuntimeContext extends BaseModuleContext {
  // 当前runtime
  public instance?: Vue

  constructor() {
    super()
  }

  /**
   * @func {*} 初始化vue运行环境
   */
  async createContext(version: string) {
    // 获取当前运行环境所需的资源
    const context = await this.getSandBoxJs('vue', version)
    // 创建插入节点
    let rootDom = document.createElement('div');
    rootDom.setAttribute('id', 'root');
    document.body.appendChild(rootDom)

    const Vue = window.Vue;

    Vue.use(Router)

    const router = new Router({
      mode: 'history',
      routes: []
    })

    const vue = (window as any).vm = new Vue({
      el: rootDom,
      router,
      render: (h: CreateElement) => h('div', { attrs: { id: 'root' } },
        [
          'vue实例',
          h('RouterView')
        ]
      )
    })


    return vue
  }

  /**
   * @func 注入路由
   */
  injectionRouter(routes: Array<RouteConfig>) {
    if(!this.instance) {
      return
    }

    this.instance.$router.addRoutes(routes);

    (this as any).instance.$router.options.routes = routes

    // this.instance.$router.push('/about')
  }
}

export default VueRuntimeContext
