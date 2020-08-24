import VueRuntimeContext from "../context/vue";
import Events from "../events";
import { GlobalContext } from "../global";
export interface ContextType {
    context: VueRuntimeContext;
}
export interface GlobalType extends Window {
    $event?: Events;
    globalContext?: GlobalContext;
}
