export interface AppApi {
  getVersion: () => Promise<string>
  getPlatform: () => Promise<NodeJS.Platform>
}

export interface HardwareApi {
  listDevices: () => Promise<
    Array<{
      id: string
      name: string
      kind: string
      connected: boolean
    }>
  >
  getStatus: () => Promise<{
    ready: boolean
    devices: Array<{
      id: string
      name: string
      kind: string
      connected: boolean
    }>
    message: string
  }>
}

export interface ElectronApi {
  app: AppApi
  hardware: HardwareApi
}

declare global {
  interface Window {
    api: ElectronApi
  }
}

export {}
