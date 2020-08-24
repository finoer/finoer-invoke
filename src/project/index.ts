import { ContextType } from "../types/context";
import { AppInfoType } from './appInfo'

interface Project {
   // 应用名称
   name: string;

  // 入口信息文件
  entry: string;

  // 项目域名
  domain: string;

  // 该应用激活的时机
  activeWhen: (location: Location) => boolean | string;

  // 应用持有的路由
  routes?: Array<string>;

  // 当前应用状态
  status?: string;

  // 应用信息
  appInfo?: AppInfoType;

  init?: (instance: ContextType['context']) => void;

  data?: {
    assetsByChunkName: assetsType
  }
}

interface assetsType {
  app: string[] | string
}

export { Project }
