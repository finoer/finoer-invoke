import { ContextType } from "../types/context";
/**
 * @func 初始化运行环境
 * @param { context - 运行环境类型: like vue }
 */
declare function initRuntimeContext(context: string, version: string): Promise<ContextType['context']>;
export default initRuntimeContext;
