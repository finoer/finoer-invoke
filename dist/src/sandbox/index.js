class Sandbox {
    constructor() {
        this.sandbox = window;
        // 是否开启沙箱
        this.sandboxDisabled = false;
        // 事件处理程序
        this.eventListeners = {};
        // 延时器id
        this.timeoutIds = [];
        // 定时器id
        this.intervalIds = [];
        this.propertyAdded = {};
        this.originalValues = {};
        if (!window.Proxy) {
            console.warn('proxy sandbox is not support by current browser');
            this.sandboxDisabled = true;
        }
        this.sandbox = null;
    }
    createProxySandbox() {
        const { propertyAdded, originalValues } = this;
        const proxyWindow = Object.create(null);
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
        proxyWindow.addEventListener = (eventName, fn, ...rest) => {
            const listeners = this.eventListeners[eventName] || [];
            listeners.push(fn);
            return originalAddEventListener.apply(originalWindow, [eventName, fn, ...rest]);
        };
        // hijack removeEventListener
        proxyWindow.removeEventListener = (eventName, fn, ...rest) => {
            const listeners = this.eventListeners[eventName] || [];
            if (listeners.includes(fn)) {
                listeners.splice(listeners.indexOf(fn), 1);
            }
            return originalRemoveEventListener.apply(originalWindow, [eventName, fn, ...rest]);
        };
        const sandbox = new Proxy(proxyWindow, {
            set(target, p, value) {
                if (!originalWindow.hasOwnProperty(p)) {
                    // 缓存已经添加的值
                    propertyAdded[p] = value;
                }
                else if (!originalWindow.hasOwnProperty(p)) {
                    // if it is already been setted in orignal window, record it's original value
                    originalValues[p] = value;
                }
                target[p] = value;
                return true;
            },
            get(target, p) {
                if (p === Symbol.unscopables) {
                    return undefined;
                }
                if (['top', 'window', 'self', 'globalThis'].includes(p)) {
                    return sandbox;
                }
                // proxy hasOwnProperty, in case of proxy.hasOwnProperty value represented as originalWindow.hasOwnProperty
                if (p === 'hasOwnProperty') {
                    // eslint-disable-next-line no-prototype-builtins
                    return (key) => !!target[key] || originalWindow.hasOwnProperty(key);
                }
                const targetValue = target[p];
                if (targetValue) {
                    // case of addEventListener, removeEventListener, setTimeout, setInterval setted in sandbox
                    return targetValue;
                }
                else {
                    const value = originalWindow[p];
                    if (isWindowFunction(value)) {
                        // fix Illegal invocation
                        return value.bind(originalWindow);
                    }
                    else {
                        // case of window.clientWidth、new window.Object()
                        return value;
                    }
                }
            },
            has(target, p) {
                return p in target || p in originalWindow;
            },
        });
        this.sandbox = sandbox;
    }
    getSandbox() {
        return this.sandbox;
    }
    execScriptInSandbox(script) {
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
            }
            catch (error) {
                console.error(`error occurs when execute script in sandbox: ${error}`);
                throw error;
            }
        }
    }
    clear() {
        if (!this.sandboxDisabled) {
            // remove event listeners
            Object.keys(this.eventListeners).forEach((eventName) => {
                (this.eventListeners[eventName] || []).forEach((listener) => {
                    window.removeEventListener(eventName, listener);
                });
            });
            // clear timeout
            this.timeoutIds.forEach(id => window.clearTimeout(id));
            this.intervalIds.forEach(id => window.clearInterval(id));
            // recover original values
            Object.keys(this.originalValues).forEach(key => {
                window[key] = this.originalValues[key];
            });
            Object.keys(this.propertyAdded).forEach(key => {
                delete window[key];
            });
        }
    }
}
// get function from original window, such as scrollTo, parseInt
function isWindowFunction(func) {
    return func && typeof func === 'function' && !isConstructor(func);
}
// check window contructor function， like Object Array
function isConstructor(fn) {
    // generator function and has own prototype properties
    const hasConstructor = fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1;
    // unnecessary to call toString if it has contructor function
    const functionStr = !hasConstructor && fn.toString();
    const upperCaseRegex = /^function\s+[A-Z]/;
    return (hasConstructor ||
        // upper case
        upperCaseRegex.test(functionStr) ||
        // ES6 class, window function do not have this case
        functionStr.slice(0, 5) === 'class');
}
export default Sandbox;
//# sourceMappingURL=index.js.map