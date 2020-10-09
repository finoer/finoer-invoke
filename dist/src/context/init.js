import VueRuntimeContext from "./vue";
import PhaserRuntimeContext from "./phaser";
/**
 * @function { Initialize the runtime context }
 * @param { context - runtime context type: like vue }
 * @param { version - runtime context version: string }
 *
 */
async function initRuntimeContext(context, version) {
    const runtimePool = {
        vue: VueRuntimeContext,
        phaser: PhaserRuntimeContext
    };
    const runtime = new runtimePool[context]();
    await runtime.getContextResource(version);
    runtime.instance = runtime.createContext(version);
    return runtime;
}
export default initRuntimeContext;
//# sourceMappingURL=init.js.map