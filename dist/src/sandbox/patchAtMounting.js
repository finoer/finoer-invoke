const rawWindowInterval = window.setInterval;
const rawWindowClearInterval = window.clearInterval;
window.intervals = [];
export function patchInterval(global) {
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
//# sourceMappingURL=patchAtMounting.js.map