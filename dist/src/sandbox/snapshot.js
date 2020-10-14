function iter(obj, callbackFn) {
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            callbackFn(prop);
        }
    }
}
export default class SnapshotSandbox {
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
            console.info(`[qiankun:sandbox] ${this.name} origin window restore...`, Object.keys(this.modifyPropsMap[this.name]));
        }
        this.sandboxRunning = false;
    }
}
//# sourceMappingURL=snapshot.js.map