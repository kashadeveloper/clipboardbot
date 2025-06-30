import TelegramBot, { Message } from 'node-telegram-bot-api'
import Clipboard from '@crosscopy/clipboard'
import fs from 'fs'
import { getClipboardFiles } from './clipboard-files'
import { logger } from './logger'

const IGNORED_MESSAGES = ['/start', '/keyboard', '🖊️ Получить буфер', '❌ Очистить буфер']

let botInstance: TelegramBot | null = null
let isBotActive = true

function isPrivateFromAuthor(msg: Message): boolean {
  return msg.chat.type === 'private' && msg.from?.id === Number(process.env.AUTHOR_ID)
}

function setupTextHandler(bot: TelegramBot): void {
  bot.on('message', (msg) => {
    if (!isBotActive) return
    if (!isPrivateFromAuthor(msg)) return

    const text = msg.text?.trim()
    if (!text || IGNORED_MESSAGES.includes(text)) return

    logger.emit('log', `Копирую текст: ${text} (${msg.from?.first_name})`)
    Clipboard.setText(text)

    bot.sendMessage(msg.chat.id, '✅')
  })
}

function setupGetClipboardHandler(bot: TelegramBot): void {
  bot.onText(/🖊️ Получить буфер/i, async (msg) => {
    if (!isBotActive) return
    if (!isPrivateFromAuthor(msg)) return
    const chatId = msg.chat.id

    try {
      if (Clipboard.hasImage()) {
        const base64 = await Clipboard.getImageBase64()
        const buffer = Buffer.from(base64, 'base64')
        await bot.sendPhoto(chatId, buffer)
        logger.emit('log', 'Отправил фото из буфера')
        return
      }

      const files = await getClipboardFiles()
      if (files.length) {
        logger.emit('log', `Отправляю файлы: ${files.join(', ')}`)
        for (const file of files) {
          await bot.sendDocument(chatId, fs.createReadStream(file))
        }
        return
      }

      if (Clipboard.hasText()) {
        const text = await Clipboard.getText()
        if (text) {
          await bot.sendMessage(chatId, text)
          logger.emit('log', 'Отправил текст из буфера')
        } else {
          await bot.sendMessage(chatId, 'Буфер пуст')
          logger.emit('log', 'Буфер пуст (текст)')
        }
      } else {
        await bot.sendMessage(chatId, 'Буфер пуст')
        logger.emit('log', 'Буфер пуст')
      }
    } catch (err: unknown) {
      logger.emit('log', `Ошибка при чтении буфера: ${(err as Error).message}`)
      await bot.sendMessage(chatId, 'Ошибка при получении буфера')
    }
  })
}

function setupClearClipboardHandler(bot: TelegramBot): void {
  bot.onText(/❌ Очистить буфер/i, async (msg) => {
    if (!isBotActive) return
    if (!isPrivateFromAuthor(msg)) return
    Clipboard.clear()
    await bot.sendMessage(msg.chat.id, '✅')
    logger.emit('log', 'Буфер очищен')
  })
}

function setupMenuHandler(bot: TelegramBot): void {
  bot.onText(/\/keyboard|\/start/i, (msg) => {
    if (!isBotActive) return
    if (!isPrivateFromAuthor(msg)) return
    bot.sendMessage(msg.chat.id, 'Меню', {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [[{ text: '🖊️ Получить буфер' }], [{ text: '❌ Очистить буфер' }]]
      }
    })
    logger.emit('log', 'Отправлено меню клавиатуры')
  })
}

function setupHandlers(bot: TelegramBot): void {
  setupTextHandler(bot)
  setupGetClipboardHandler(bot)
  setupClearClipboardHandler(bot)
  setupMenuHandler(bot)

  bot.on('polling_error', (err) => {
    logger.emit('log', `❌ Polling error: ${err.message}`)
  })

  bot.startPolling()
  logger.emit('log', '✅ Bot started')
}

export async function main(token: string, authorId: string): Promise<void> {
  isBotActive = true
  if (token) process.env.BOT_TOKEN = token
  if (authorId) process.env.AUTHOR_ID = authorId
  if (!process.env.AUTHOR_ID) throw new Error('AUTHOR_ID is required')

  botInstance = new TelegramBot(process.env.BOT_TOKEN || '')

  setupHandlers(botInstance)
}

export async function stop(): Promise<void> {
  isBotActive = false
  if (botInstance) {
    botInstance.stopPolling()
    logger.emit('log', 'Bot stopped.')
  }
}

export { logger }
