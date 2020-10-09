interface ObjectProperType {
  [prop: string]: any
}

class Sandbox {
  private sandbox: Window | null = window;

  // 是否开启沙箱
  public sandboxDisabled: boolean = false;

  // 事件处理程序
  private eventListeners: ObjectProperType = {};

  // 延时器id
  private timeoutIds: number[] = [];

  // 定时器id
  private intervalIds: number[] = [];

  private propertyAdded: ObjectProperType = {};

  private originalValues: ObjectProperType = {};


  constructor() {
    if (!window.Proxy) {
      console.warn('proxy sandbox is not support by current browser');
      this.sandboxDisabled = true;
    }

    this.sandbox = null;
  }

  createProxySandbox() {
    const { propertyAdded, originalValues } = this;

    const proxyWindow = Object.create(null) as Window;

    const originalWindow = window;

    const originalAddEventListener = window.addEventListener;
    const originalRemoveEventListener = window.removeEventListener;
    const originalSetInerval = window.setInterval;
    const originalSetTimeout = window.setTimeout;

    // hijack setTimeout
    proxyWindow.setTimeout = (...args) => {
      const timerId = originalSetTimeout(...args);
      this.timeoutIds.push(timerId);
      return timerId;
    };
    // hijack setInterval
    proxyWindow.setInterval = (...args) => {
      const intervalId = originalSetInerval(...args);
      this.intervalIds.push(intervalId);
      return intervalId;
    };
    // hijack addEventListener
    proxyWindow.addEventListener = (eventName: string, fn: (this: Window, ev: any) => any, ...rest: any) => {
      const listeners = this.eventListeners[eventName] || [];
      listeners.push(fn);
      return (originalAddEventListener as any).apply(originalWindow, [eventName, fn, ...rest]);
    };
    // hijack removeEventListener
    proxyWindow.removeEventListener = (eventName: string, fn: (this: Window, ev: any) => any, ...rest: any) => {
      const listeners = this.eventListeners[eventName] || [];
      if (listeners.includes(fn)) {
        listeners.splice(listeners.indexOf(fn), 1);
      }
      return (originalRemoveEventListener as any).apply(originalWindow, [eventName, fn, ...rest]);
    };

    const sandbox = new Proxy(proxyWindow, {

      set(target: Window, p: PropertyKey, value: any) {
        if (!originalWindow.hasOwnProperty(p)) {
          // 缓存已经添加的值
          propertyAdded[p as string] = value
        } else if (!originalWindow.hasOwnProperty(p)) {
          // if it is already been setted in orignal window, record it's original value
          originalValues[p as any] = value
        }

        (target as any)[p] = value
        return true
      },

      get(target: Window, p: PropertyKey): any {
        if (p === Symbol.unscopables) {
          return undefined;
        }
        if (['top', 'window', 'self', 'globalThis'].includes(p as string)) {
          return sandbox;
        }
        // proxy hasOwnProperty, in case of proxy.hasOwnProperty value represented as originalWindow.hasOwnProperty
        if (p === 'hasOwnProperty') {
          // eslint-disable-next-line no-prototype-builtins
          return (key: PropertyKey) => !!(target as any)[key] || originalWindow.hasOwnProperty(key);
        }
        const targetValue = (target as any)[p];
        if (targetValue) {
          // case of addEventListener, removeEventListener, setTimeout, setInterval setted in sandbox
          return targetValue;
        } else {
          const value = (originalWindow as any)[p];
          if (isWindowFunction(value)) {
            // fix Illegal invocation
            return value.bind(originalWindow);
          } else {
            // case of window.clientWidth、new window.Object()
            return value;
          }
        }
      },
      has(target: Window, p: PropertyKey): boolean {
        return p in target || p in originalWindow;
      },
    })

    this.sandbox = sandbox
  }

  getSandbox() {
    return this.sandbox;
  }

  execScriptInSandbox(script: string): void {
    if (!this.sandboxDisabled) {
      // create sandbox before exec script
      if (!this.sandbox) {
        this.createProxySandbox();
      }
      try {
        const execScript = `with (sandbox) {;${script}\n}`;
        // eslint-disable-next-line no-new-func
        const code = new Function('sandbox', execScript).bind(this.sandbox);
        // run code with sandbox
        code(this.sandbox);
      } catch (error) {
        console.error(`error occurs when execute script in sandbox: ${error}`);
        throw error;
      }
    }
  }

  clear() {
    if (!this.sandboxDisabled) {
      // remove event listeners
      Object.keys(this.eventListeners).forEach((eventName) => {
        (this.eventListeners[eventName] || []).forEach((listener: any) => {
          window.removeEventListener(eventName, listener);
        });
      });
      // clear timeout
      this.timeoutIds.forEach(id => window.clearTimeout(id));
      this.intervalIds.forEach(id => window.clearInterval(id));
      // recover original values
      Object.keys(this.originalValues).forEach(key => {
        (window as any)[key] = this.originalValues[key];
      });
      Object.keys(this.propertyAdded).forEach(key => {
        delete (window as any)[key];
      });
    }
  }
}

// get function from original window, such as scrollTo, parseInt
function isWindowFunction(func: any) {
  return func && typeof func === 'function' && !isConstructor(func);
}

// check window contructor function， like Object Array
function isConstructor(fn: () => void) {
  // generator function and has own prototype properties
  const hasConstructor = fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1;
  // unnecessary to call toString if it has contructor function
  const functionStr = !hasConstructor && fn.toString();
  const upperCaseRegex = /^function\s+[A-Z]/;

  return (
    hasConstructor ||
    // upper case
    upperCaseRegex.test(functionStr as string) ||
    // ES6 class, window function do not have this case
    (functionStr as string).slice(0, 5) === 'class'
  );
}

export default Sandbox
