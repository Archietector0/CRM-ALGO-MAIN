import { getSubTaskByUuid, getTaskById } from "../../db/constants/constants.js";
import { writeLogToDB } from "../../db/logger.js";
import { telegramBot } from "../../telegram/TelegramBot.js";
import { NOTIFICATION } from "../../telegram/constants/constants.js";
import { MAIN_KEYBOARD } from "../../telegram/constants/keyboards.js";

export async function cbqNoticeUser ({ response, user, bot }) {
  const command = (user.getState().split('*'))[1];
  const noticeUserTask = NOTIFICATION.NOTE_USER_TASK.split('*')[1]
  const accepTask = NOTIFICATION.ACCEPT_TASK.split('*')[1]
  const noticeUserSubTask = NOTIFICATION.NOTE_USER_STASK.split('*')[1]
  const accepSubTask = NOTIFICATION.ACCEPT_STASK.split('*')[1]

  if (!user.getTask().getLinkId() && !user.subTaskUuid) {
    await telegramBot.editMessage({
      msg: response,
      phrase: 'SERVER WAS RESTARTED',
      user,
      keyboard: MAIN_KEYBOARD,
      bot
    })
    return
  }

  switch (command) {
    case noticeUserTask: {
      const currentTask = await getTaskById(user.getTask().getLinkId())
      const chatId = currentTask.performer_id
      const keyboard = {
        inline_keyboard: [
          [{
            text: 'Понятно',
            callback_data: NOTIFICATION.ACCEPT_TASK,
          }],
        ],
      }

      try {
        const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОпять отдыхаешь? Время делать дела, ведь у тебя новая таска )))\n\nЦель: Таска\nПроект: ${currentTask.project_name}\nЗаголовок: ${currentTask.task_header}`
        await bot.sendMessage(chatId, phrase, {
          parse_mode: 'HTML',
          reply_markup: keyboard
        })
      } catch (e) {
        await writeLogToDB({
          response,
          user,
          error: e
        })
      }
      user.setState('deleter')
      break
    } case accepTask: {
      const currentTask = await getTaskById(user.getTask().getLinkId())
      const chatId = currentTask.performer_id
      const msgId = user.getMainMsgId()

      try {
        await bot.deleteMessage(chatId, msgId)
      } catch (e) {
        await writeLogToDB({
          response,
          user,
          error: e
        })
      }
      user.setState('deleter')
      break
    } case noticeUserSubTask: {

      const currentSubTask = await getSubTaskByUuid(user.subTaskUuid)
      const bindTask = await getTaskById(user.getTask().getLinkId())
      const chatId = user.getUserId() //currentSubTask.performer_id

      const keyboard = {
        inline_keyboard: [
          [{
            text: 'Понятно',
            callback_data: NOTIFICATION.ACCEPT_STASK,
          }],
        ],
      }

      try {
        const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОпять отдыхаешь? Время делать дела, ведь у тебя новая таска )))\n\nЦель: Субтаска\nПроект: ${bindTask.project_name}\nЗаголовок: ${currentSubTask.subtask_header}`
        await bot.sendMessage(chatId, phrase, {
          parse_mode: 'HTML',
          reply_markup: keyboard
        })
      } catch (e) {
        await writeLogToDB({
          response,
          user,
          error: e
        })
      }
      user.setState('deleter')
      break
    } case accepSubTask: {
      const currentSubTask = await getSubTaskByUuid(user.subTaskUuid)
      const chatId =  currentSubTask.performer_id
      const msgId = user.getMainMsgId()

      console.log(chatId);
      console.log(msgId);

      try {
        await bot.deleteMessage(chatId, msgId)
      } catch (e) {
        await writeLogToDB({
          response,
          user,
          error: e
        })
      }
      user.setState('deleter')
      break
    }
  }
}