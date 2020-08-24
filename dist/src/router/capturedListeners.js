export const routingEventsListeningTo = [
    'popstate', 'hashChange'
];
const captureEventListeners = {
    'popstate': [],
    'hashChange': [],
};
let historyState;
export function callCaptureedEventListeners() {
    if (historyState) {
        Object.keys(captureEventListeners).forEach(eventName => {
            const capturedListeners = captureEventListeners[eventName];
            if (capturedListeners.length) {
                capturedListeners.forEach((listener) => {
                    listener.call(null, createPopStateEvent(historyState));
                });
            }
        });
    }
}
export function createPopStateEvent(state) {
    // We need a popstate event even though the browser doesn't do one by default when you call replaceState, so that
    // all the applications can reroute.
    try {
        return new PopStateEvent('popstate', { state });
    }
    catch (err) {
        // IE 11 compatibility
        // https://docs.microsoft.com/en-us/openspecs/ie_standards/ms-html5e/bd560f47-b349-4d2c-baa8-f1560fb489dd
        const evt = document.createEvent('PopStateEvent');
        evt.initPopStateEvent('popstate', false, false, state);
        return evt;
    }
}
export function isInCapturedEventListeners(eventName, fn) {
    return find(captureEventListeners[eventName], fn);
}
export function addCapturedEventListeners(eventName, fn) {
    captureEventListeners[eventName].push(fn);
}
export function removeCapturedEventListeners(eventName, listenerFn) {
    captureEventListeners[eventName] = captureEventListeners[eventName].filter((fn) => fn !== listenerFn);
}
export function find(list, element) {
    if (!Array.isArray(list)) {
        return false;
    }
    return list.filter(item => item === element).length > 0;
}
//# sourceMappingURL=capturedListeners.js.map