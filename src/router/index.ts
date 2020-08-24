import { routingEventsListeningTo, isInCapturedEventListeners, addCapturedEventListeners, removeCapturedEventListeners } from "./capturedListeners";
import Invoke from "../invoke";
import { Apps } from "../applycation/register";




// 缓存原生事件， 后面需要重写
const originalAddEventListener = window.addEventListener;
const originalRemoveEventLister = window.removeEventListener;
const originalPushState = window.history.pushState;
const originalReplaceState = window.history.replaceState;

class Router {
  public invoke: Invoke
  constructor(invoke: Invoke) {
    this.invoke = invoke

    this.hijackHistory();
    this.hijackEventListener();

  }

  reroute() {
    this.invoke.performAppChnage(Apps)
    console.error('路由改变了~~~' )
  }

  hijackHistory() {
    const me = this
    window.history.pushState = function(state: any, title: string, url: string | null | undefined, ...rest){
      let result = originalPushState.apply(this, [state, title, url]);

      console.log('result', result)
      me.reroute()

      return result
    }

    window.history.replaceState = function(state: any, title: string, url: string | null | undefined, ...rest) {
      let result = originalReplaceState.apply(this, [state, title, url])

      console.log('result', result)
      me.reroute();

      return result;
    }
  }
  // EventListenerOrEventListenerObject
  hijackEventListener() {
    window.addEventListener = (eventName: string, fn: EventListenerOrEventListenerObject, purpol?: boolean | AddEventListenerOptions) => {
      if(
        typeof fn === 'function' &&
        routingEventsListeningTo.indexOf(eventName) > -1 &&
        !isInCapturedEventListeners(eventName, fn)
      ) {
        addCapturedEventListeners(eventName, fn);
        return;
      }

      return originalAddEventListener.apply(window, [eventName, fn, purpol]);

    }

    window.removeEventListener = (eventName: string, fn: EventListenerOrEventListenerObject, purpol?: boolean | AddEventListenerOptions) => {
      if (typeof fn === 'function' && routingEventsListeningTo.indexOf(eventName) >= 0) {
        removeCapturedEventListeners(eventName, fn);
        return;
      }

      return originalRemoveEventLister.apply(window, [eventName, fn, purpol]);
    };
  }
}


export default Router
