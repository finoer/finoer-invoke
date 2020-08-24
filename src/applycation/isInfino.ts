import { getStore } from "./store"

export const isInFino = () => {
  return !!getStore('root')
}
