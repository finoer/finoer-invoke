## fino-invoke使用文档

> 顾名思义， `fino-invoke`即fino框架的调度模块， 负责在合适的时机挂载和下载对应的微前端项目应用

### 如何使用

第一步： 首先加载全局应用列表文件， 如下：

```js
const projectList = [
  {
    name: 'yueqi1',
    activeWhen: function (location: Location) {
      const route= window.location.href.split(window.location.origin)[1]
      return route.startsWith('/yueqi')
    },
    domain: "http://localhost:8080",
    entry: '/rcms/stats.js',
  },
  {
    name: 'jinzhao',
    activeWhen: function (location: Location) {
      const route= window.location.href.split(window.location.origin)[1]
      return route.startsWith('/jinzhao')
    },
    domain: "http://localhost:8081",
    entry: '/rcms/stats.js',
  },
  {
    name: 'blue',
    activeWhen: function (location: Location) {
      const route= window.location.href.split(window.location.origin)[1]
      return route.startsWith('/blue')
    },
    domain: "http://localhost:8007",
    entry: '/rcms/stats.js',
  },
]

export default projectList
```

第二步： 引入fino-invoke调度模块，

那么基座应用就完了

```js
import { invoke, registerApps } from 'Packs/finoer-invoke'
// 主应用的loading动画
import Loading from './utils/loading'
// 注册应用
registerApps(projectList)

const loading = new Loading()
// 应用进入钩子
invoke.$event.subscribe('appEnter', () => {
  loading.hide()
})
// 应用离开的钩子
invoke.$event.subscribe('appLeave', () => {
  loading.show()
})
```

第三步： 子模块

如何将项目作为子模块接入fino项目

webpack打包配置： 

```js
const { StatsWriterPlugin } = require("webpack-stats-plugin")
plugins: [
  ...,
  new StatsWriterPlugin({

        filename: "rcms/stats.js", // Default,
        transform(data, opts) {
          const content =
`
  (function(){
      const methods = ${JSON.stringify({
        ...data.assetsByChunkName,
        context: 'vue',
        version: '2.6.10'
      })};
      $event.notify('baseInfoLoaded', methods)
  })()
`
          return content;
        }
	})
]

```

main.js: 

```js
// 是否在fino的基座用运行
const isInFinoRuntime = invoke.isInFinoRuntime()

// 如果不在fino基座中运行，即项目独立运行的时候， 使用自己的加载机制
if(!isInFinoRuntime) {
  Vue.use(Router)

  const router = new Router({
    mode: 'history',
    routes: routerArray
  })
  new (Vue as any)({
    el: "#app",
    router,
    render: (h: any) => h(App)
  })
}else {
  // 使用fino的加载机制
  const finoApp = {
    name: "yueqi1",
    init: (instance: VueRuntimeContext) => {
      instance.injectionRouter(routerArray)
    }
  };

  invoke.$event.notify('childAppLoaded', finoApp)
}
```

我所认为的现存的问题：

1. 创建context运行环境: 新增一种运行环境需要按照规定的类去继承实现它的方法， rcmsContext? 

   ```js
   
   import { GlobalContext, globalContext } from '../global/index'
   /**
    * @class 管理子模块的运行环境
    * @mehtods {*} createContext
    * @mehtods {*} loadContext
    * @mehtods {*} unmountContext
    */
   
   import { tagLoadJs } from "../loader";
   
   abstract class BaseModuleContext {
     // 资源的base url
     public baseUrl: string = `https://cdn.bootcdn.net/ajax/libs`;
   
     public context: string = ""
   
     constructor(type: string) {
       this.context = type
     }
   
     // 获取运行环境沙箱
     public getSandBoxJs(type: string, version: string) {
       const url = `${this.baseUrl}/${type}/${version}/${type}.min.js`;
       return tagLoadJs(url)
     }
   
     abstract createContext(version: string): vueContext | reactContext | phaserContext
   
     abstract destroy(): void
   
   }
   
   export default BaseModuleContext
   
   ```

2. 暂时没有考虑css， js全局污染的问题

3. 加载的超时时间问题。 降级处理， 提示

   

4. 运行环境插件化

5. css， js隔离

6. 加载机制。

   