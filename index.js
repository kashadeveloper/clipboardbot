import { clipboard } from "clipboard-sys";
import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import Clipboard from '@crosscopy/clipboard';
import fs from 'fs'
import iconv from 'iconv-lite'

const bot = new TelegramBot(process.env.BOT_TOKEN);

let lastClipboard = ""
const ignoredMessages = ["/start", "/keyboard", "🖊️ Получить буфер", "❌ Очистить буфер"];


bot.on("message", (msg) => {
  if (msg.from.id != process.env.AUTHOR_ID || msg.chat.type != "private") return;

  const text = msg.text?.trim();

  if (!text || ignoredMessages.includes(text)) return;

  lastClipboard = text;
  Clipboard.setText(text)

  bot.sendMessage(msg.from.id, "✅");
});

bot.onText(/🖊️ Получить буфер/i, async (msg) => {
  const chatId = msg.chat.id;

  try {
    if (Clipboard.hasImage()) {
      const base64 = await Clipboard.getImageBase64();
      const buffer = Buffer.from(base64, "base64");
      await bot.sendPhoto(chatId, buffer);
      return;
    }


    const files = await clipboard.readFiles();
        
    if (files.length > 0) {
        console.log(files)
      for (const filePath of files) {
        // console.log(Buffer.from(filePath))
        console.log(fixEncoding(filePath))
        await bot.sendDocument(chatId, fs.createReadStream(fixEncoding(filePath)));
      }
      return;
    }

    // 3. Иначе отправляем текст
    const text = await Clipboard.getText()
    if (text) {
      await bot.sendMessage(chatId, text);
    } else {
      await bot.sendMessage(chatId, "Буфер пуст");
    }
  } catch (err) {
    console.error("Ошибка при чтении буфера:", err);
    await bot.sendMessage(chatId, "Ошибка при получении буфера");
  }
});

bot.onText(/❌ Очистить буфер/i, async(msg) => {
    Clipboard.clear();
    return bot.sendMessage(msg.from.id, "✅")
})

bot.onText(/\/keyboard|\/start/i, (msg) => {
  return bot.sendMessage(msg.from.id, "Меню", {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            ["🖊️ Получить буфер"],
            ["❌ Очистить буфер"]
        ]
    }
  });
});


async function main() {
  if (!process.env.AUTHOR_ID)
    throw Error("AUTHOR_ID is required env variable!");

  try {
    bot.startPolling();
  } catch (error) {
    console.log(error);
  }
}

function fixEncoding(str) {
  const buf = Buffer.from(str, 'binary');
  return iconv.decode(buf, 'win1251');
}

main();
