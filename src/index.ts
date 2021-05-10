
import { registerApps } from './applycation/register';
import Invoke from './invoke/index';
import Router from './router';
import { GlobalType } from './types/context';
const global: GlobalType = window
const invoke = new Invoke()
const router = new Router(invoke);

(window as any).router = router

export { registerApps, invoke, router }

