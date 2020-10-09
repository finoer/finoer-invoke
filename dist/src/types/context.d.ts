import VueRuntimeContext from "../context/vue";
import Events from "../events";
import { GlobalContext } from "../global";
import PhaserRuntimeContext from "../context/phaser";
export interface ContextType {
    context: VueRuntimeContext | PhaserRuntimeContext;
}
export interface GlobalType extends Window {
    $event?: Events;
    globalContext?: GlobalContext;
}
export interface FinoType {
    vue?: Vue;
    Vue?: Vue;
    vueRouter?: any;
}
