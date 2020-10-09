import Invoke from "../invoke";
declare class Router {
    invoke: Invoke;
    constructor(invoke: Invoke);
    reroute(): void;
    push(url: string): void;
    hijackHistory(): void;
    hijackEventListener(): void;
    handlePopState(event: PopStateEvent): void;
}
export default Router;
