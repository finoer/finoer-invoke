import VueRuntimeContext from "./vue";
import { ContextType } from "../types/context";
import PhaserRuntimeContext from "./phaser";

/**
 * @func 初始化运行环境
 * @param { context - 运行环境类型: like vue }
 */

async function initRuntimeContext(context: string, version: string): Promise<ContextType['context']> {
  const runtimePool: any = {
    vue: VueRuntimeContext,
    phaser: PhaserRuntimeContext
  }

  const runtime: ContextType['context'] = new runtimePool[context]();

  const source = await runtime.getContextResource(version);

  runtime.instance = runtime.createContext(version)

  return runtime
}

export default initRuntimeContext
