import { registerApps } from './applycation/register';
import Invoke from './invoke/index';
import Router from './router';
const invoke = new Invoke();
const router = new Router(invoke);
export { registerApps, invoke };
//# sourceMappingURL=index.js.map