// import { globalContext } from "../global";
// import BaseModuleContext from "./base";

// // const { createApp, h } = Vue
// class Vue3RuntimeContext extends BaseModuleContext {
//   public instance?: any
//   constructor() {
//     super('vue3')
//   }

//   /**
//    * @func { Get running environment resources }
//    * @param version
//    */
//   async getContextResource(version: string) {
//     if (globalContext.contextSourceCache.vue3) {
//       return
//     }

//     // 获取当前运行环境所需的资源
//     const context = await this.getSandBoxJs('vue', version, 'vue')
//     const routerLib = await this.getSandBoxJs('vue-router', '4.0.5', 'vue-router')

//     globalContext.contextSourceCache.vue3 = true
//     globalContext.contextSourceCache.vue3Router = true

//     return context
//   }

//   createContext(version: string) {
//     // let Vue = (window as any)['Vue']
//     // create root node
//     let rootDom = document.createElement('div');
//     rootDom.setAttribute('id', 'fino-vue-root');
//     document.body.appendChild(rootDom);

//     // vue3赋值
//     window.Vue3 = (window as any).Vue || window['Vue3'];
//     // Vue = undefined;
//     window.VueRouter3 = window.VueRouter3 || window.VueRouter;
//     window.VueRouter = undefined

//     const Vue3 = window.Vue3
//     const VueRouter3 = window.VueRouter3

//     const { createRouter, createWebHistory, RouterView, RouterLink } = VueRouter3
//     const { createApp, h } = Vue3

//     const router = createRouter({
//       history: createWebHistory(),
//       routes: [],
//     });

//     const vue = window.vue3 = createApp({
//       render: () => {
//         return h('div', {}, [h(RouterView, {},), 12312])
//       }
//     }).use(router).component('router-link', RouterLink).mount('#fino-vue-root')


//     return vue
//   }

//   /**
//   * @func { Injection router }
//   */
//   injectionRouter(routes: Array<any>) {
//     const instance: any = (this.instance as any)
//     if (!this.instance) {
//       return
//     }
//     routes.forEach((item) => {
//       instance.$router.addRoute(item);
//     });

//     instance.$router.options.routes = routes;

//     const route = window.location.href.split(window.location.origin)[1].split('/').join('/');

//     setTimeout(() => {
//       instance.$router.push(route)
//     }, 1000)
//     //
//   }

//   destroy() {
//     this.instance && this.instance.$destroy()
//     const element = document.getElementById('fino-vue-root')
//     element && document.body.removeChild(element)
//   }
// }

// export default Vue3RuntimeContext
