import { registerAppHandlers } from './app.handlers'
import { registerHardwareHandlers } from './hardware.handlers'

export function registerIpcHandlers(): void {
  registerAppHandlers()
  registerHardwareHandlers()
}
