export declare const routingEventsListeningTo: string[];
export declare function callCaptureedEventListeners(): void;
export declare function createPopStateEvent(state: any): any;
export declare function isInCapturedEventListeners(eventName: string, fn: any): boolean;
export declare function addCapturedEventListeners(eventName: string, fn: any): void;
export declare function removeCapturedEventListeners(eventName: string, listenerFn: any): void;
export declare function find(list: Array<any>, element: any): boolean;
