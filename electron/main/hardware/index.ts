import type { HardwareDevice, HardwareStatus } from './types'

/**
 * Hardware adapter stubs — replace with real device drivers later.
 * Keep all Node-native device I/O in this folder (main process only).
 */

export async function listDevices(): Promise<HardwareDevice[]> {
  return []
}

export async function getHardwareStatus(): Promise<HardwareStatus> {
  return {
    ready: false,
    devices: [],
    message: 'Hardware adapters not configured yet'
  }
}
