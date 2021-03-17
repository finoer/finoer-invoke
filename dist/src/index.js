(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.finoerInvoke = {}));
}(this, (function (exports) { 'use strict';

  const namespace = 'FINO';
  function setStore(key, value) {
      if (!window[namespace]) {
          window[namespace] = {};
      }
      window[namespace][key] = value;
  }
  function getStore(key) {
      const fino = window[namespace];
      return fino && fino[key] ? fino[key] : null;
  }

  let Apps = [];
  function registerApps(app) {
      setStore('root', 'root');
      Apps = invoke.init(app);
      return Apps;
  }

  /**
   * @class 全局单例
   */
  class GlobalContext {
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
          this.activeContext = window;
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
  const globalContext = getGlobalContext();

  const BOOTSTRAP = 'BOOTSTRAP';
  const MOUNT = 'MOUNT';
  const UNMOUNT = 'UNMOUNT';

  // import apps from '../model/index'
  /**
   * @function 获取当前应该被加载的应用
   * @param { apps - 应用列表 }
   * @return { app - 需要被加载的应用 }
   */
  function getAppShouldBeActive(apps) {
      let result;
      apps.forEach((item, index) => {
          if (item.activeWhen(window.location) && item.status) {
              item.status === UNMOUNT && (item.status = BOOTSTRAP);
              result = {
                  app: item,
                  index: index
              };
          }
      });
      return result;
  }
  /**
   * @function 获取当前应该被卸载的应用
   * @param global
   * @param { apps - 应用列表 }
   * @return { app - 需要被加载的应用 }
   */
  function getAppShouldBeUnmount(apps) {
      let result = [];
      apps.forEach((item, index) => {
          if (!item.activeWhen(window.location) && item.status === MOUNT) {
              result.push({
                  app: item,
                  index: index
              });
          }
      });
      return result;
  }
  /**
   * @func 进入loading模式
   * @parans { show - 是否展示loading }
   */
  // 卸载标签
  function removeChild(id) {
      let element = document.getElementById(id);
      element && document.body.removeChild(element);
  }
  function registerEvents(global) {
      if (!global.$event) {
          return;
      }
      global.$event.subscribe('baseInfoLoaded', baseInfoLoaded);
      global.$event.subscribe('childAppLoaded', childAppLoaded);
  }
  function baseInfoLoaded(data) {
      globalContext.activeAppInfo = data;
      return data;
  }
  function childAppLoaded(data) {
      globalContext.activedApplication = data;
      return data;
  }

  class Events {
      constructor() {
          // 事件池
          this._events = {};
      }
      /**
       * 添加订阅方法
       * @param type 订阅事件的类型（名字）
       * @param listener 订阅事件的回调
       * @param flay 插入顺序
       */
      subscribe(type, listener, flag) {
          // 如果订阅的事件在事件池里面存在
          if (this._events[type]) {
              if (this._events[type].indexOf(listener) > -1) {
                  return;
              }
              flag ?
                  this._events[type].unshift(listener) :
                  this._events[type].push(listener);
              return;
          }
          this._events[type] = [listener];
      }
      /**
       * 通知消息
       * @param type 需要分发的事件的名字
       * @param args 回调函数的参数
       */
      notify(type, args) {
          let argument = args || [];
          if (this._events[type]) {
              this._events[type].forEach((fn) => fn.call(this, argument));
          }
      }
      /**
       * 移除当前绑定的事件
       * @param type 事件类型
       * @param listener 事件回调函数
       */
      removeListener(type, listener) {
          if (this._events[type]) {
              this._events[type].filter((fn) => {
                  return fn !== listener && fn.orign !== listener;
              });
          }
      }
      /**
       * 优先执行订阅
       * @param type
       * @param listener
       */
      prepend(type, listener) {
          this.subscribe(type, listener, true);
      }
  }

  const baseUrl = "";
  var AssetTypeEnum;
  (function (AssetTypeEnum) {
      AssetTypeEnum["INLINE"] = "inline";
      AssetTypeEnum["EXTERNAL"] = "external";
  })(AssetTypeEnum || (AssetTypeEnum = {}));
  function tagLoadJs(src) {
      let { scriptTag, timestamp } = createJs();
      return new Promise((resolve, reject) => {
          scriptTag.onload = () => resolve(null);
          scriptTag.onerror = (err) => {
              setTimeout(() => {
                  document.head.removeChild(scriptTag);
                  let s2 = createJs();
                  s2.scriptTag.onload = resolve;
                  s2.scriptTag.onerror = reject;
                  s2.scriptTag.src = baseUrl + src + "?" + timestamp;
                  document.head.appendChild(s2.scriptTag);
                  reject(err);
              }, 1000);
          };
          scriptTag.src = baseUrl + src + "?" + timestamp;
          scriptTag.id = baseUrl + src;
          document.body.appendChild(scriptTag);
      });
  }
  function tagLoadCss(link) {
      let { styleTag, timestamp } = createCss();
      return new Promise((resolve) => {
          styleTag.onload = () => resolve(null);
          styleTag.href = baseUrl + link + "?" + timestamp;
          styleTag.rel = "stylesheet";
          styleTag.id = baseUrl + link;
          document.body.appendChild(styleTag);
          resolve(null);
      });
  }
  function getEntryJs(url) {
      return new Promise((resolve, reject) => {
          tagLoadJs(url).then(() => {
              // 加载完成的内容会挂载到这个globalContext上
              resolve(globalContext.activeAppInfo);
          }).catch(e => {
              reject(e);
          });
      });
  }
  function createCss() {
      const styleTag = document.createElement('link');
      const timestamp = +new Date();
      styleTag.id = "timestamp";
      return {
          styleTag,
          timestamp
      };
  }
  function createJs() {
      const scriptTag = document.createElement('script');
      const timestamp = +new Date();
      scriptTag.type = "text/javascript";
      scriptTag.id = "timestamp";
      return {
          scriptTag,
          timestamp
      };
  }
  async function loadCss(cssList) {
      for (let i = 0; i < cssList.length; i++) {
          await tagLoadCss(cssList[i]);
      }
  }

  /**
   * @class 管理子模块的运行环境
   * @mehtods {*} createContext
   * @mehtods {*} loadContext
   * @mehtods {*} unmountContext
   */
  class BaseModuleContext {
      constructor(type) {
          // 资源的base url
          this.baseUrl = `https://cdn.bootcdn.net/ajax/libs`;
          this.context = "";
          this.context = type;
      }
      // 获取运行环境沙箱
      getSandBoxJs(type, version) {
          const url = `${this.baseUrl}/${type}/${version}/${type}.min.js`;
          return tagLoadJs(url);
      }
  }

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
          window['Vue2'] = window['Vue'] || window['Vue2'];
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

  /// <reference path="../types/phaser.d.ts" />
  class PhaserRuntimeContext extends BaseModuleContext {
      constructor() {
          super("phaser");
      }
      /**
       * @func 获取资源
       * @param version
       */
      async getContextResource(version) {
          if (globalContext.contextSourceCache.phaser) {
              return;
          }
          // 获取当前运行环境所需的资源
          const context = await this.getSandBoxJs('phaser', version);
          //
          const Phaser = window['Phaser'];
          globalContext.contextSourceCache.phaser = true;
          globalContext.contextSourceCache.SpinePlugin = true;
          return Phaser;
      }
      /**
       * @func {*} Initialize the phaser operating environment
       */
      createContext() {
          // phaser3.23不可以异步注入场景， 因此需要在注入路由的时候创建实例
      }
      initGame(scenes) {
          const root = document.createElement('div');
          root.id = 'root';
          document.body.appendChild(root);
          // Create game instance
          const gameConfig = {
              type: Phaser.AUTO,
              width: window.innerWidth,
              height: window.innerHeight,
              resolution: 2,
              autoFocus: true,
              transparent: true,
              parent: root,
              scene: scenes,
              scale: {
                  mode: Phaser.Scale.FIT,
                  autoCenter: Phaser.Scale.CENTER_BOTH
              },
          };
          // debugger
          const game = new Phaser.Game(gameConfig);
          return game;
      }
      /**
       * @func {*} injection routing
       */
      injectionRouter(scenes) {
          if (!this.instance) {
              this.instance = this.initGame([scenes[scenes.length - 1]]);
              scenes.pop();
          }
          let canvas = document.querySelector('#root');
          canvas && canvas.setAttribute('style', `display: block`);
          Object.keys(scenes).map((key, index) => {
              this.instance && this.instance.scene.add(scenes[(key)].name, scenes[index]);
          });
      }
      /**
       * @func {*} destroy the current running instance
       * @remark {}
       */
      destroy() {
          if (!this.instance) {
              return;
          }
          let canvas = document.querySelector('#root');
          canvas && document.body.removeChild(canvas);
          this.instance.destroy(true);
          this.instance.plugins.removeScenePlugin('SpinePlugin');
      }
  }

  /**
   * @function { Initialize the runtime context }
   * @param { context - runtime context type: like vue }
   * @param { version - runtime context version: string }
   *
   */
  async function initRuntimeContext(context, version) {
      const runtimePool = {
          vue: VueRuntimeContext,
          phaser: PhaserRuntimeContext
      };
      const runtime = new runtimePool[context]();
      await runtime.getContextResource(version);
      runtime.instance = runtime.createContext(version);
      return runtime;
  }

  function iter(obj, callbackFn) {
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const prop in obj) {
          if (obj.hasOwnProperty(prop)) {
              callbackFn(prop);
          }
      }
  }
  class SnapshotSandbox {
      constructor(name) {
          this.type = 'Snapshot';
          this.sandboxRunning = true;
          this.modifyPropsMap = {};
          // 缓存应用名字
          this.appCache = [];
          this.name = name;
          this.proxy = window;
      }
      active() {
          const _window = window;
          // 记录当前快照
          this.windowSnapshot = {};
          this.modifyPropsMap[this.name] = this.modifyPropsMap[this.name] || {};
          !this.appCache.includes(this.name) && this.appCache.push(this.name);
          iter(_window, prop => {
              this.windowSnapshot[prop] = _window[prop];
          });
          // 恢复之前的变更
          Object.keys(this.modifyPropsMap[this.name]).forEach((p) => {
              _window[p] = this.modifyPropsMap[this.name][p];
          });
          this.sandboxRunning = true;
      }
      inactive() {
          const _window = window;
          if (!this.windowSnapshot || !this.name) {
              return;
          }
          this.modifyPropsMap[this.name] = {};
          iter(window, prop => {
              if (_window[prop] !== this.windowSnapshot[prop]) {
                  // 记录变更，恢复环境
                  this.modifyPropsMap[this.name][prop] = _window[prop];
                  _window[prop] = this.windowSnapshot[prop];
              }
          });
          if (process.env.NODE_ENV === 'development') {
              console.info(`[andbox] ${this.name} origin window restore...`, Object.keys(this.modifyPropsMap[this.name]));
          }
          this.sandboxRunning = false;
      }
  }

  const rawWindowInterval = window.setInterval;
  const rawWindowClearInterval = window.clearInterval;
  window.intervals = [];
  function patchInterval(global) {
      const _window = window;
      global.clearInterval = (intervalId) => {
          _window.intervals = _window.intervals.filter((id) => id !== intervalId);
          return rawWindowClearInterval(intervalId);
      };
      global.setInterval = (handler, timeout, ...args) => {
          const intervalId = rawWindowInterval(handler, timeout, ...args);
          console.log('intervalId', intervalId);
          if (!_window.intervals.includes(intervalId)) {
              _window.intervals = [..._window.intervals, intervalId];
          }
          return intervalId;
      };
      return function free() {
          _window.intervals.forEach((id) => {
              global.clearInterval(id);
          });
      };
  }

  /**
   * @methods { life cycle-bootstrap }
   */
  async function bootstrap(app, sandbox, loadFn) {
      let activeProject;
      const entryStatePath = app.entry.indexOf('http') > -1 ? app.entry : app.domain + app.entry;
      // Get application js packaging information
      activeProject = await getEntryJs(entryStatePath);
      // activate the sandbox
      if (!sandbox.appCache.includes(app.name)) {
          sandbox.name = app.name;
          sandbox.active();
      }
      // load application entry file { init: () => {}, name: string, destory: () => {} }
      globalContext.activedApplication = await loadFn(app.domain, globalContext.activeAppInfo);
      removeChild(app.domain + app.entry);
      // Execute mount life cycle
      return mount(app, sandbox);
  }
  /**
   * @methods { life cycle-mount }
   * @des Create a running environment and inject routing
   */
  async function mount(app, sandbox) {
      const runtime = globalContext.activeContext;
      // The runtime context is initialized successfully, and the route is injected
      if (app.status === MOUNT) {
          globalContext.activedApplication = app;
          sandbox.name = app.name;
          sandbox.active();
      }
      app.dynamicElements.css && (await loadCss(app.dynamicElements.css));
      if (app.name === globalContext.activedApplication.name) {
          // injection router
          globalContext.activedApplication.init && globalContext.activedApplication.init(runtime, globalContext.activeContext);
      }
      app.status = MOUNT;
      return app;
  }
  /**
   * @methods { life cycle-unmount }
   * @des
  */
  async function unmount(apps, sandbox, mode) {
      return new Promise((resolve) => {
          if (!apps) {
              resolve();
          }
          // resolve()
          for (let i = 0; i < apps.length; i++) {
              if (!apps[i].app.dynamicElements.js)
                  continue;
              // 卸载应用标签
              for (let j = 0; j < apps[i].app.dynamicElements.js.length; j++) {
                  removeChild(apps[i].app.dynamicElements.js[j]);
              }
              for (let j = 0; j < apps[i].app.dynamicElements.css.length; j++) {
                  removeChild(apps[i].app.dynamicElements.css[j]);
              }
              if (mode === 'safe') {
                  apps[i].app.dynamicElements.js = [];
                  // 将状态设置位UNMOUNT
                  apps[i].app.status = UNMOUNT;
              }
          }
          sandbox.inactive();
          resolve();
      });
  }

  var LifeCircle;
  (function (LifeCircle) {
      LifeCircle["BOOTSTRAP"] = "bootstrap";
      LifeCircle["MOUNTED"] = "mount";
  })(LifeCircle || (LifeCircle = {}));
  const lifecircleFn = { bootstrap, mount };
  let isFrist = true;
  class Invoke {
      constructor() {
          // Operating environment: whether to run on the base or the sub-module to run independently
          this.runtimeInfino = true;
          // Application List
          this.appList = [];
          // Run submodule: the first one by default
          this.app = Apps[0];
          // mode: safe or speed
          this.mode = 'speed';
          const global = window;
          this.$event = global.$event = new Events();
          this.sandbox = new SnapshotSandbox('');
          registerEvents(global);
          this.free = patchInterval(window);
      }
      /**
       * @methods { Initialize the project list }
       * @param apps { project list as array }
       */
      init(apps) {
          apps.map((item, index) => {
              item.status = BOOTSTRAP;
          });
          this.appList = apps;
          return this.appList;
      }
      /**
       * @methods { Scheduling applications, uninstalling the runtime, and mounting new applications }
       * @desc
       * @params { - apps: Project child project list }
       */
      async performAppChnage(apps) {
          // Get the application that needs to be mounted
          const activeApp = getAppShouldBeActive(apps);
          if (!activeApp) {
              throw new Error('没有需要挂载的应用');
          }
          this.app = activeApp.app;
          this.app.dynamicElements = this.app.dynamicElements || { js: [], css: [] };
          // uninstall apps that do not require activation
          const unmountApps = getAppShouldBeUnmount(apps);
          // restore the sandbox environment
          if (!isFrist) {
              this.free();
          }
          isFrist = false;
          if (unmountApps) {
              await unmount(unmountApps, this.sandbox, this.mode);
          }
          this.$event.notify('beforeAppEnter');
          if (this.app.status === MOUNT) {
              globalContext.activedApplication = this.app;
          }
          // Trigger loading animation
          if (!this.app.init) {
              this.$event.notify('appLeave');
          }
          globalContext.activeContext = await this.setRuntimeContext(this.app);
          // Get the life cycle function of the current application(bootstrap, mount)
          const lifecircle = this.app.status.toLocaleLowerCase();
          this.app = await lifecircleFn[lifecircle](this.app, this.sandbox, this.getModuleJs.bind(this));
          // At this time, the various information of the app is ready, merge the cached information to the current app
          this.app = Object.assign(this.app, globalContext.activeAppInfo, globalContext.activedApplication);
          Apps[activeApp.index] = this.app;
          this.$event.notify('appEnter');
      }
      /**
       * @methods The application is successfully mounted, and the sub-application is notified
       */
      async setRuntimeContext(activeProject) {
          if (!activeProject) {
              return globalContext.activeContext;
          }
          // Create the runtime context
          let runtime = globalContext.activeContext;
          // If the runtime context of the new application is different from the previous one, uninstall it
          if (!this.app.context || this.app.context !== globalContext.activeContext.context) {
              activeProject.context &&
                  Object.assign(globalContext.activeAppInfo, {
                      context: activeProject.context, version: activeProject.version
                  });
              // uninstall before app runtime context,
              if (runtime && runtime.destroy) {
                  runtime.destroy();
              }
              // store the created runtime environment in the global
              runtime = globalContext.activeContext = await initRuntimeContext(globalContext.activeAppInfo.context, globalContext.activeAppInfo.version);
          }
          else {
              // If the runtime context is the same, reuse directly
              runtime = globalContext.activeContext;
          }
          return runtime;
      }
      /**
       * @methods Get application js
       */
      async getModuleJs(baseDomain, assetsData) {
          // const assets = Object.keys(assetsData);
          for (let i = 0; i < assetsData.length; i++) {
              if (typeof (assetsData[i]) === 'string') {
                  const entry = assetsData[i];
                  const url = baseDomain + '/' + entry;
                  if (entry.indexOf('.css') > -1) {
                      this.app.dynamicElements.css.indexOf(url) === -1 &&
                          this.app.dynamicElements.css.push(url);
                      continue;
                  }
                  else if (entry.indexOf('.js') > -1) {
                      await getEntryJs(url);
                  }
                  else {
                      let source = new Image();
                      source.src = url;
                  }
                  if (this.mode === 'safe') {
                      this.app.dynamicElements.js.push(url);
                  }
                  continue;
              }
          }
          return globalContext.activedApplication;
      }
      /**
       * @methods { runtimeInFino }
       * @desc { 确定当前是否在基座运行 }
       */
      isInFinoRuntime() {
          return !!getStore('root');
      }
      start() {
          setStore('root', 'root');
          this.performAppChnage(this.appList);
      }
  }

  const routingEventsListeningTo = [
      'popstate', 'hashChange'
  ];
  const captureEventListeners = {
      'popstate': [],
      'hashChange': [],
  };
  function isInCapturedEventListeners(eventName, fn) {
      return find(captureEventListeners[eventName], fn);
  }
  function addCapturedEventListeners(eventName, fn) {
      captureEventListeners[eventName].push(fn);
  }
  function removeCapturedEventListeners(eventName, listenerFn) {
      captureEventListeners[eventName] = captureEventListeners[eventName].filter((fn) => fn !== listenerFn);
  }
  function find(list, element) {
      if (!Array.isArray(list)) {
          return false;
      }
      return list.filter(item => item === element).length > 0;
  }

  // 缓存原生事件， 后面需要重写
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventLister = window.removeEventListener;
  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;
  class Router {
      constructor(invoke) {
          this.invoke = invoke;
          this.hijackHistory();
          this.hijackEventListener();
      }
      reroute() {
          this.invoke.app && this.invoke.performAppChnage(Apps);
      }
      push(url) {
          // if(globalContext.activeContext.instance) {
          // }
          // globalContext.activeContext.instance.$router.push(url)
          window.history.pushState(null, '', url);
      }
      hijackHistory() {
          const me = this;
          window.history.pushState = function (state, title, url, ...rest) {
              let result = originalPushState.apply(this, [state, title, url]);
              me.reroute();
              return result;
          };
          window.history.replaceState = function (state, title, url, ...rest) {
              let result = originalReplaceState.apply(this, [state, title, url]);
              me.reroute();
              return result;
          };
          window.onpopstate = (event) => {
              me.reroute();
          };
          window.addEventListener('popstate', () => {
              me.reroute();
          }, false);
      }
      // EventListenerOrEventListenerObject
      hijackEventListener() {
          window.addEventListener = (eventName, fn, purpol) => {
              if (typeof fn === 'function' &&
                  routingEventsListeningTo.indexOf(eventName) > -1 &&
                  !isInCapturedEventListeners(eventName, fn)) {
                  addCapturedEventListeners(eventName, fn);
                  return;
              }
              return originalAddEventListener.apply(window, [eventName, fn, purpol]);
          };
          window.removeEventListener = (eventName, fn, purpol) => {
              if (typeof fn === 'function' && routingEventsListeningTo.indexOf(eventName) >= 0) {
                  removeCapturedEventListeners(eventName, fn);
                  return;
              }
              return originalRemoveEventLister.apply(window, [eventName, fn, purpol]);
          };
      }
      handlePopState(event) {
      }
  }

  const invoke = new Invoke();
  const router = new Router(invoke);
  console.log('33');

  exports.invoke = invoke;
  exports.registerApps = registerApps;
  exports.router = router;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
