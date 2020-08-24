import { Project } from "../project"
import { invoke } from ".."
import { setStore } from "./store";

export let Apps: Array<Project> = []

export function registerApps(app: Array<Project>): Array<Project> {
  Apps = app;

  setStore('root', 'root')
  invoke.performAppChnage(Apps)


  return Apps
}
