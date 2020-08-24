import Invoke from "../invoke";
declare class Router {
    invoke: Invoke;
    constructor(invoke: Invoke);
    reroute(): void;
    hijackHistory(): void;
    hijackEventListener(): void;
}
export default Router;
