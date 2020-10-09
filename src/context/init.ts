import VueRuntimeContext from "./vue";
import { ContextType } from "../types/context";
import PhaserRuntimeContext from "./phaser";

/**
 * @function { Initialize the runtime context }
 * @param { context - runtime context type: like vue }
 * @param { version - runtime context version: string }
 *
 */

async function initRuntimeContext(context: string, version: string): Promise<ContextType['context']> {
  const runtimePool: any = {
    vue: VueRuntimeContext,
    phaser: PhaserRuntimeContext
  }

  const runtime: ContextType['context'] = new runtimePool[context]();

  await runtime.getContextResource(version);

  runtime.instance = runtime.createContext(version)


  return runtime
}

export default initRuntimeContext
