/**
 * Renderer-side hardware helpers — call window.api (preload bridge).
 * Native drivers live in electron/main/hardware/, not here.
 */

export async function getHardwareStatus() {
  if (typeof window === 'undefined' || !window.api?.hardware) {
    return {
      ready: false,
      devices: [],
      message: 'Hardware API unavailable (not running in Electron)'
    }
  }
  return window.api.hardware.getStatus()
}

export async function listHardwareDevices() {
  if (typeof window === 'undefined' || !window.api?.hardware) {
    return []
  }
  return window.api.hardware.listDevices()
}

export async function getAppVersion(): Promise<string> {
  if (typeof window === 'undefined' || !window.api?.app) {
    return '0.1.0-web'
  }
  return window.api.app.getVersion()
}
