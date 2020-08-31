import { Project } from "../project";
import { GlobalType } from "../types/context";
interface MatchAppType {
    app: Project;
    index: number;
}
/**
 * @function 获取当前应该被加载的应用
 * @param { apps - 应用列表 }
 * @return { app - 需要被加载的应用 }
 */
export declare function getAppShouldBeActive(apps: Array<Project>): MatchAppType;
/**
 * @func 进入loading模式
 * @parans { show - 是否展示loading }
 */
export declare function registerEvents(global: GlobalType): void;
export declare function getAppMountTime(app: Project): string | boolean;
export declare function firstUpperCase(str: string): string;
export {};
