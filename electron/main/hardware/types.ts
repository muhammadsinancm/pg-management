export type HardwareDeviceKind = 'printer' | 'scanner' | 'biometric' | 'serial' | 'other'

export interface HardwareDevice {
  id: string
  name: string
  kind: HardwareDeviceKind
  connected: boolean
}

export interface HardwareStatus {
  ready: boolean
  devices: HardwareDevice[]
  message: string
}
