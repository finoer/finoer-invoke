import { ContextType } from "../context";
import { AppInfoType } from './appInfo';
import { GlobalContext } from "../../global";
interface Project {
    name: string;
    entry: string;
    domain: string;
    activeWhen: (location: Location) => boolean | string;
    routes?: Array<string>;
    status: string;
    appInfo?: AppInfoType;
    init?: (instance: ContextType['context'], context?: GlobalContext['activeContext']) => void;
    version: string;
    context: string;
    data?: {
        assetsByChunkName: assetsType;
    };
    dynamicElements: {
        css: Array<string>;
        js: Array<string>;
    };
}
interface BaseProject {
    name: string;
    entry: string;
    domain: string;
    status?: string;
    activeWhen: (location: Location) => boolean | string;
}
interface assetsType {
    app: string[] | string;
}
export { BaseProject, Project };
