import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}

export interface API {
  checkCredentials(token: string, userId: string): Promise<boolean>
  setStore(key: string, value: unknown): void
  getStore(key: string): Promise<any>
  startBot(): void
  stopBot(): void
}
