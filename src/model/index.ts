import { Project } from "../project";

const apps: Array<Project> = [
  {
    name: 'yueqi1',
    domain: "http://localhost:8080",
    activeWhen: function (location: Location) {
      return location.hash === '#/home'
    },
    routes: [],
    status: 'NOT_LOADED',
    entry: '/rcms/stats111.js',
    init: (instance) =>{
      alert(instance)
    }
  }
]

export default apps
