import { ipcMain } from 'electron'
import { listDevices, getHardwareStatus } from '../hardware'

/**
 * Hardware IPC stubs. Wire real device adapters in electron/main/hardware/
 * and expose them here when integration begins.
 */
export function registerHardwareHandlers(): void {
  ipcMain.handle('hardware:listDevices', async () => listDevices())
  ipcMain.handle('hardware:getStatus', async () => getHardwareStatus())
}
