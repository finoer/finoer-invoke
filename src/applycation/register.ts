import { Project, BaseProject } from "../types/project"
import { invoke } from ".."
import { setStore } from "./store";

export let Apps: Array<Project> = []

export function registerApps(app: Array<BaseProject>): Array<Project> {

  setStore('root', 'root')
  Apps = invoke.init(app)

  return Apps
}
