function iter(obj: object, callbackFn: (prop: any) => void) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      callbackFn(prop);
    }
  }
}

interface ObjectProps {
  [props: string]: Record<any, any>
}


export default class SnapshotSandbox {
  proxy: WindowProxy;

  name: string;

  type: string = 'Snapshot';

  sandboxRunning = true;

  private windowSnapshot!: Window;

  private modifyPropsMap: ObjectProps = {};

  // 缓存应用名字
  public appCache: Array<string> = []

  constructor(name: string) {
    this.name = name;
    this.proxy = window;
  }

  active() {
    // 记录当前快照
    this.windowSnapshot = {} as Window;
    this.modifyPropsMap[this.name] = this.modifyPropsMap[this.name] || {};

    !this.appCache.includes(this.name) && this.appCache.push(this.name)

    iter(window, prop => {
      this.windowSnapshot[prop] = window[prop];
    });

    // 恢复之前的变更
    Object.keys(this.modifyPropsMap[this.name]).forEach((p: any) => {
      window[p] = this.modifyPropsMap[this.name][p];
    });

    this.sandboxRunning = true;
  }

  inactive() {
    if(!this.windowSnapshot || !this.name) {
      return
    }

    this.modifyPropsMap[this.name] = {};

    iter(window, prop => {
      if (window[prop] !== this.windowSnapshot[prop]) {
        // 记录变更，恢复环境
        this.modifyPropsMap[this.name][prop] = window[prop];
        window[prop] = this.windowSnapshot[prop];
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.info(`[qiankun:sandbox] ${this.name} origin window restore...`, Object.keys(this.modifyPropsMap[this.name]));
    }

    this.sandboxRunning = false;
  }
}
