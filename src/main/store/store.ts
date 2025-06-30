// store.ts
import ElectronStore from 'electron-store'

type StoreSchema = {
  token: string
  userId: string
}

const store = new ElectronStore<StoreSchema>()

export default store
