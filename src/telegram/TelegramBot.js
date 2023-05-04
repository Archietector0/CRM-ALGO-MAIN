// import { writeLogToDB } from "../db/logger.js";

class TelegramBot {
  // Private vars

  // Public vars

  // Constructor
  constructor () {}

  async editMessage({ msg, phrase, user, keyboard = {}, bot }) {
    let chatId;
    let messageId;
    let flag = 0;

    for (let key in msg) if (key === 'message') flag = 1;

    chatId = !flag ? msg.chat.id : msg.message.chat.id;
    messageId = user.mainMsgId //!flag ? msg.message_id : msg.message.message_id;

    try {
      await bot.editMessageText(phrase, {
        parse_mode: 'HTML',
        chat_id: chatId,
        message_id: messageId,
        reply_markup: keyboard,
      });
    } catch (e) {
      // await writeLogToDB({ msg, userSession: user, error: e })
      console.log(`ERROR: ${e.message}`);
    }
  }

  async sendMessage({ msg, phrase, user, keyboard = {}, bot }) {
    let chatId;
    let flag = 0;

    for (let key in msg) if (key === 'message') flag = 1;

    chatId = !flag ? msg.chat.id : msg.message.chat.id;

    try {
      await bot.sendMessage(chatId, phrase, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });
    } catch (e) {
      // await writeLogToDB({ msg, userSession: user, error: e })
      console.log(`ERROR: ${e.message}`);
    }
  }

  async deleteMsg({ msg, user, bot }) {
    let chatId;
    let messageId;
    let flag = 0;

    for (let key in msg) if (key === 'message') flag = 1;

    chatId = !flag ? msg.chat.id : msg.message.chat.id;
    messageId = !flag ? msg.message_id : msg.message.message_id;

    try {
      await bot.deleteMessage(chatId, messageId);
    } catch (e) {
      // await writeLogToDB({ msg, userSession: user, error: e })
      console.log(`ERROR: ${e.message}`);
    }
  }
}

export const telegramBot = new TelegramBot()