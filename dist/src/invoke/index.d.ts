import { Project } from "../project";
import Events from "../events";
declare class Invoke {
    runtimeInfino: boolean;
    app: Project;
    $event: Events;
    constructor();
    /**
     * @methods { 调度app模块 }
     * @desc
     * @params { - apps: 子模块列表 }
     */
    performAppChnage(apps: Array<Project>): Promise<void>;
    /**
     * @function getModuleJs
     */
    getModuleJs(assetsData: any): Promise<Project>;
    /**
    * @function 获取js加载地址
    * @param { url - 应用地址 }
    */
    getEntryJs(url: string): Promise<any>;
    /**
     * @methods { runtimeInFino }
     * @desc { 确定当前是否在基座运行 }
     */
    isInFinoRuntime(): boolean;
    start(): void;
}
export default Invoke;
