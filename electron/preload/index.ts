import { contextBridge, ipcRenderer } from 'electron'
import type { ElectronApi } from './api'

const api: ElectronApi = {
  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    getPlatform: () => ipcRenderer.invoke('app:getPlatform')
  },
  hardware: {
    listDevices: () => ipcRenderer.invoke('hardware:listDevices'),
    getStatus: () => ipcRenderer.invoke('hardware:getStatus')
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  Object.assign(globalThis, { api })
}
