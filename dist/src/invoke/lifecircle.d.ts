import SnapshotSandbox from "../sandbox/snapshot";
import { MatchAppType } from "../types/context";
import { Project } from "../types/project";
/**
 * @methods { life cycle-bootstrap }
 */
export declare function bootstrap(app: Project, sandbox: SnapshotSandbox, loadFn: (baseDomain: string, assetsData: any) => Promise<Project>): Promise<Project>;
/**
 * @methods { life cycle-mount }
 * @des Create a running environment and inject routing
 */
export declare function mount(app: Project, sandbox: SnapshotSandbox): Promise<Project>;
/**
 * @methods { life cycle-unmount }
 * @des
*/
export declare function unmount(apps: MatchAppType[], sandbox: SnapshotSandbox, mode: string): Promise<void>;
/**
 * @methods The application is successfully mounted, and the sub-application is notified
 */
export declare function mounted(): Promise<void>;
export declare function bootstraping(app: Project): Promise<Project>;
