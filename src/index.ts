
import { registerApps } from './applycation/register';
import Database from '@finoer/finoer-store';
import Invoke from './invoke/index';
import Router from './router';
import { ExtendsDatabaseType, GlobalType } from './types/context';

const global: GlobalType = window
const invoke = new Invoke()
const router = new Router(invoke)
const $data: ExtendsDatabaseType = global.$data = global.$data ? global.$data : new Database()

// export default finoer
console.log('代码更新了最终版555', $data)
export { registerApps, invoke, router, $data}




