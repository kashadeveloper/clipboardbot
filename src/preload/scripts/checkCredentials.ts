import TelegramBot from 'node-telegram-bot-api'

export async function checkCredentials(token: string, userId: string): Promise<boolean> {
  try {
    const bot = new TelegramBot(token)
    const result = await bot.sendMessage(userId, 'Бот работает', {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [[{ text: '🖊️ Получить буфер' }], [{ text: '❌ Очистить буфер' }]]
      }
    })
    if (result) return true
    return false
  } catch {
    return false
  }
}
