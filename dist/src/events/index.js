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
export default Events;
//# sourceMappingURL=index.js.map