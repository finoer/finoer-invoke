import { invoke } from "..";
import { setStore } from "./store";
export let Apps = [];
export function registerApps(app) {
    setStore('root', 'root');
    Apps = invoke.init(app);
    return Apps;
}
//# sourceMappingURL=register.js.map