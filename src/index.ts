
import { registerApps } from './applycation/register';
import { GlobalType } from './types/context'
import { isInFino } from './applycation/isInfino'
import Invoke from './invoke/index';
import Router from './router';

const invoke = new Invoke()
const router = new Router(invoke)

export { registerApps, invoke, router }




