
export const routingEventsListeningTo = [
    'popstate', 'hashChange'
]

const captureEventListeners: any = {
    'popstate': [],
    'hashChange': [],
}

let historyState: any

export function callCaptureedEventListeners() {
    if (historyState) {
        Object.keys(captureEventListeners).forEach(eventName => {
            const capturedListeners = (captureEventListeners as any)[eventName];
            if (capturedListeners.length) {
                capturedListeners.forEach((listener: any) => {
                    listener.call(null, createPopStateEvent(historyState));
                })
            }

        })
    }
}

export function createPopStateEvent(state: any) {
    // We need a popstate event even though the browser doesn't do one by default when you call replaceState, so that
    // all the applications can reroute.
    try {
        return new PopStateEvent('popstate', { state });
    } catch (err) {
        // IE 11 compatibility
        // https://docs.microsoft.com/en-us/openspecs/ie_standards/ms-html5e/bd560f47-b349-4d2c-baa8-f1560fb489dd
        const evt: any = document.createEvent('PopStateEvent');
        evt.initPopStateEvent('popstate', false, false, state);
        return evt;
    }
}

export function isInCapturedEventListeners(eventName: string, fn: any) {
    return find(captureEventListeners[eventName], fn);
}

export function addCapturedEventListeners(eventName: string, fn: any) {
    captureEventListeners[eventName].push(fn);
}

export function removeCapturedEventListeners(eventName: string, listenerFn: any) {
    captureEventListeners[eventName] = captureEventListeners[eventName].filter(
        (fn: any) => fn !== listenerFn,
    );
}

export function find(list: Array<any>, element: any) {
    if (!Array.isArray(list)) {
        return false;
    }

    return list.filter(item => item === element).length > 0;
}

