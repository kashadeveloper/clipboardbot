import store from './store/store'

export function saveCredentials(token: string, user_id: string): boolean {
  store.set('token', token)
  store.set('userId', user_id)

  return true
}
