const rawWindowInterval = window.setInterval;
const rawWindowClearInterval = window.clearInterval;

(window as any).intervals = [];

export function patchInterval(global: Window) {
  const _window: any = window

  global.clearInterval = (intervalId: number) => {
    _window.intervals = _window.intervals.filter((id: number) => id !== intervalId);
    return rawWindowClearInterval(intervalId);
  };

  global.setInterval = (handler: Function, timeout?: number, ...args: any[]) => {
    const intervalId = rawWindowInterval(handler, timeout, ...args);

    console.log('intervalId', intervalId);

    if(!_window.intervals.includes(intervalId)) {
      _window.intervals = [..._window.intervals, intervalId];
    }

    return intervalId;
  };

  return function free() {
    _window.intervals.forEach((id: number) => {
      global.clearInterval(id)
    });
  };
}
