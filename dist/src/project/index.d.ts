import { ContextType } from "../types/context";
import { AppInfoType } from './appInfo';
interface Project {
    name: string;
    entry: string;
    domain: string;
    activeWhen: (location: Location) => boolean | string;
    routes?: Array<string>;
    status?: string;
    appInfo?: AppInfoType;
    init?: (instance: ContextType['context']) => void;
    data?: {
        assetsByChunkName: assetsType;
    };
}
interface assetsType {
    app: string[] | string;
}
export { Project };
