import { invoke } from "..";
import { setStore } from "./store";
export let Apps = [];
export function registerApps(app) {
    Apps = app;
    setStore('root', 'root');
    invoke.performAppChnage(Apps);
    return Apps;
}
//# sourceMappingURL=register.js.map