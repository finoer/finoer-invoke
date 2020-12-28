import { registerApps } from './applycation/register';
import Invoke from './invoke/index';
import Router from './router';
import { ExtendsDatabaseType } from './types/context';
declare const invoke: Invoke;
declare const router: Router;
declare const $data: ExtendsDatabaseType;
export { registerApps, invoke, router, $data };
