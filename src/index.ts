
import { registerApps } from './applycation/register';
import Database from '@finoer/finoer-store';
import Invoke from './invoke/index';
import Router from './router';
import { ExtendsDatabaseType, GlobalType } from './types/context';
const global: GlobalType = window
const $data: ExtendsDatabaseType = global.$data = global.$data ? global.$data : new Database()
const invoke = new Invoke()
const router = new Router(invoke)

// initialize the data store of the current module
invoke.$event.subscribe('appEnter', () => {
  global.$data && global.$data.init(invoke.app.name)
})

console.log('这里是代码最终版')

export { registerApps, invoke, router, $data}

