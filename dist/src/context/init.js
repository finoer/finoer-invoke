import VueRuntimeContext from "./vue";
/**
 * @func 初始化运行环境
 * @param { context - 运行环境类型: like vue }
 */
async function initRuntimeContext(context, version) {
    const runtimePool = {
        vue: VueRuntimeContext,
    };
    const runtime = new runtimePool[context]();
    runtime.instance = await runtime.createContext(version);
    return runtime;
}
export default initRuntimeContext;
//# sourceMappingURL=init.js.map