/**
 * @class 管理子模块的运行环境
 * @mehtods {*} createContext
 * @mehtods {*} loadContext
 * @mehtods {*} unmountContext
 */
import { tagLoadJs } from "../loader";
class BaseModuleContext {
    constructor(type) {
        // 资源的base url
        this.baseUrl = `https://cdn.bootcdn.net/ajax/libs`;
        this.context = "";
        this.context = type;
    }
    // 获取运行环境沙箱
    getSandBoxJs(type, version) {
        const url = `${this.baseUrl}/${type}/${version}/${type}.min.js`;
        return tagLoadJs(url);
    }
}
export default BaseModuleContext;
//# sourceMappingURL=base.js.map