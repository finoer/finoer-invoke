import { Project } from "../types/project";
import { GlobalType, MatchAppType } from "../types/context";
/**
 * @function 获取当前应该被加载的应用
 * @param { apps - 应用列表 }
 * @return { app - 需要被加载的应用 }
 */
export declare function getAppShouldBeActive(apps: Array<Project>): MatchAppType | undefined;
/**
 * @function 获取当前应该被卸载的应用
 * @param global
 * @param { apps - 应用列表 }
 * @return { app - 需要被加载的应用 }
 */
export declare function getAppShouldBeUnmount(apps: Array<Project>): Array<MatchAppType>;
export declare const isObject: (obj: unknown) => boolean;
/**
 * @func 进入loading模式
 * @parans { show - 是否展示loading }
 */
export declare function removeChild(id: string): void;
export declare function registerEvents(global: GlobalType): void;
export declare function getAppMountTime(app: Project): string | boolean;
export declare function firstUpperCase(str: string): string;
