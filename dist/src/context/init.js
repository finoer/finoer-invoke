import VueRuntimeContext from "./vue";
import PhaserRuntimeContext from "./phaser";
/**
 * @func 初始化运行环境
 * @param { context - 运行环境类型: like vue }
 */
async function initRuntimeContext(context, version) {
    const runtimePool = {
        vue: VueRuntimeContext,
        phaser: PhaserRuntimeContext
    };
    const runtime = new runtimePool[context]();
    const source = await runtime.getContextResource(version);
    runtime.instance = runtime.createContext(version);
    return runtime;
}
export default initRuntimeContext;
//# sourceMappingURL=init.js.map