
import { VueConstructor } from "vue/types/umd"



export interface AppInfoType {
  app: string;
  context: string;
  version: string;
  instance?: VueConstructor<Vue> | Window | any,
}
