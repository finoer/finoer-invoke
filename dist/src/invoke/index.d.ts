import { Project, BaseProject } from "../types/project";
import { ContextType } from '../types/context';
import Events from "../events";
import SnapshotSandbox from "../sandbox/snapshot";
declare class Invoke {
    runtimeInfino: boolean;
    appList: Array<Project>;
    app: Project;
    $event: Events;
    mode: string;
    sandbox: SnapshotSandbox;
    free: any;
    constructor();
    /**
     * @methods { Initialize the project list }
     * @param apps { project list as array }
     */
    init(apps: Array<BaseProject>): Project[];
    /**
     * @methods { Scheduling applications, uninstalling the runtime, and mounting new applications }
     * @desc
     * @params { - apps: Project child project list }
     */
    performAppChnage(apps: Array<Project>): Promise<void>;
    /**
     * @methods The application is successfully mounted, and the sub-application is notified
     */
    setRuntimeContext(activeProject: Project['appInfo']): Promise<ContextType['context']>;
    /**
     * @methods Get application js
     */
    getModuleJs(baseDomain: string, assetsData: any): Promise<Project>;
    /**
     * @methods { runtimeInFino }
     * @desc { 确定当前是否在基座运行 }
     */
    isInFinoRuntime(): boolean;
    start(): void;
}
export default Invoke;
