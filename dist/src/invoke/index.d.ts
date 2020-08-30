import { Project, BaseProject } from "../project";
import Events from "../events";
declare class Invoke {
    runtimeInfino: boolean;
    appList: Array<Project>;
    app: Project;
    $event: Events;
    constructor();
    /**
     * @methods { 初始化项目列表 }
     * @param apps
     */
    init(apps: Array<BaseProject>): Project[];
    /**
     * @methods { 调度app模块 }
     * @desc
     * @params { - apps: 子模块列表 }
     */
    performAppChnage(apps: Array<Project>): Promise<void>;
    /**
     * @methods { bootstrap生命周期函数 }
     */
    bootstrap(): Promise<void>;
    /**
     * @methods { mount生命周期函数 }
     * @des 创建运行环境， 注入路由
     */
    mount(): Promise<void>;
    mounted(): void;
    /**
     * @function getModuleJs
     */
    getModuleJs(baseDomain: string, assetsData: any): Promise<Project>;
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
