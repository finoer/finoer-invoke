import Invoke from "../invoke";
import { Apps } from './register';
let started = false;
export default function start() {
    if (started) {
        return;
    }
    started = true;
    const invoke = new Invoke();
    return invoke.performAppChange(Apps);
}
//# sourceMappingURL=start.js.map