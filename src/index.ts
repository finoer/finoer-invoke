
import { registerApps } from './applycation/register';
import Invoke from './invoke/index';
import Router from './router';
import { GlobalType } from './types/context';
alert(1)

const global: GlobalType = window
const invoke = new Invoke()
const router = new Router(invoke)

console.log('888');

(window as any).router = router

export { registerApps, invoke, router }

