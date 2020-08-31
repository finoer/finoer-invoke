import { ContextType } from "../types/context";
/**
 * @function { Initialize the runtime context }
 * @param { context - runtime context type: like vue }
 * @param { version - runtime context version: string }
 *
 */
declare function initRuntimeContext(context: string, version: string): Promise<ContextType['context']>;
export default initRuntimeContext;
