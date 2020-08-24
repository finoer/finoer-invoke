declare class Events {
    private _events;
    /**
     * 添加订阅方法
     * @param type 订阅事件的类型（名字）
     * @param listener 订阅事件的回调
     * @param flay 插入顺序
     */
    subscribe(type: string, listener: (data: any) => any, flag?: boolean): void;
    /**
     * 通知消息
     * @param type 需要分发的事件的名字
     * @param args 回调函数的参数
     */
    notify(type: string, args?: string[] | undefined | any): void;
    /**
     * 移除当前绑定的事件
     * @param type 事件类型
     * @param listener 事件回调函数
     */
    removeListener(type: string, listener: any): void;
    /**
     * 优先执行订阅
     * @param type
     * @param listener
     */
    prepend(type: string, listener: any): void;
}
export default Events;
