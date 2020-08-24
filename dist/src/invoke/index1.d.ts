import { Project } from "../project";
declare class Invoke {
    pedestalStatus: string;
    app: Project;
    /**
     * @function 获取js加载地址
     * @param { url - 应用地址 }
     */
    getEntryJs(url: string): Promise<any>;
    /**
     * @function registerApp
     * @param apps
     */
    performAppChange(apps: Array<Project>): Promise<void>;
    /**
     * @function
     */
    getEntryJsPath(assetsData: any): Promise<string | undefined>;
}
export default Invoke;
