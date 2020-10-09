import { routingEventsListeningTo, isInCapturedEventListeners, addCapturedEventListeners, removeCapturedEventListeners } from "./capturedListeners";
import { Apps } from "../applycation/register";
import { globalContext } from "../global";
// 缓存原生事件， 后面需要重写
const originalAddEventListener = window.addEventListener;
const originalRemoveEventLister = window.removeEventListener;
const originalPushState = window.history.pushState;
const originalReplaceState = window.history.replaceState;
class Router {
    constructor(invoke) {
        this.invoke = invoke;
        this.hijackHistory();
        this.hijackEventListener();
    }
    reroute() {
        this.invoke.app && this.invoke.performAppChnage(Apps);
    }
    push(url) {
        globalContext.activeContext.instance.$router.push(url);
    }
    hijackHistory() {
        const me = this;
        window.history.pushState = function (state, title, url, ...rest) {
            let result = originalPushState.apply(this, [state, title, url]);
            me.reroute();
            return result;
        };
        window.history.replaceState = function (state, title, url, ...rest) {
            let result = originalReplaceState.apply(this, [state, title, url]);
            me.reroute();
            return result;
        };
        window.onpopstate = (event) => {
            console.error('popState触发了');
            me.reroute();
        };
        window.addEventListener('popstate', () => {
            console.error('popState触发了');
            me.reroute();
        }, false);
    }
    // EventListenerOrEventListenerObject
    hijackEventListener() {
        window.addEventListener = (eventName, fn, purpol) => {
            if (typeof fn === 'function' &&
                routingEventsListeningTo.indexOf(eventName) > -1 &&
                !isInCapturedEventListeners(eventName, fn)) {
                addCapturedEventListeners(eventName, fn);
                return;
            }
            return originalAddEventListener.apply(window, [eventName, fn, purpol]);
        };
        window.removeEventListener = (eventName, fn, purpol) => {
            if (typeof fn === 'function' && routingEventsListeningTo.indexOf(eventName) >= 0) {
                removeCapturedEventListeners(eventName, fn);
                return;
            }
            return originalRemoveEventLister.apply(window, [eventName, fn, purpol]);
        };
    }
    handlePopState(event) {
    }
}
export default Router;
//# sourceMappingURL=index.js.map