import { BotStateEvent } from '@renderer/types/events/bot-state'
import { reactive } from 'vue'

export const store = reactive({
  logs: [] as string[],
  botState: {} as BotStateEvent,
  addLog(log: string) {
    this.logs.push(log)
  },
  clearLogs() {
    this.logs = []
  },
  setBotState(event: BotStateEvent) {
    this.botState = event
  }
})
