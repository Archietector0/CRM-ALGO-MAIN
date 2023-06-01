import { telegramBot } from "../telegram/TelegramBot.js";
import { CREATE_SUBTASK_KEYBOARD, CREATE_TASK_KEYBOARD, EDIT_SUBTASK_KEYBOARD, EDIT_TASK_KEYBOARD, MAIN_KEYBOARD } from "../telegram/constants/keyboards.js";
import { genSubTaskPhrase, genTaskPhrase } from "./cbQueryOperationLogic.js";
import { CST_MENU, CT_MENU, EAP, EST_MENU, ET_MENU, GA_MENU } from "../telegram/constants/constants.js";
import { getTaskById } from "../db/constants/constants.js";
import { deepClone } from "./helper.js";
import { googleSheet } from "../googleSheet/GoogleSheet.js";
import { TABLE_NAMES, TABLE_RANGE } from "../googleSheet/constants/constants.js";

export async function processingMessageOperationLogic({ response, user, bot }) {
  const command = (user.getState().split('*')).length >= 2 ? (user.getState().split('*'))[1] : user.getState();
  const inputTaskHeader = CT_MENU.INPUT_TASK_HEADER.split('*')[1]
  const inputTaskDesc = CT_MENU.INPUT_TASK_DESC.split('*')[1]
  const inputSubTaskHeader = CST_MENU.INPUT_STASK_HEADER.split('*')[1]
  const inputSubTaskDesc = CST_MENU.INPUT_STASK_DESC.split('*')[1]
  const editTaskHeader = ET_MENU.EDIT_HEADER.split('*')[1]
  const editTaskDesc = ET_MENU.EDIT_DESC.split('*')[1]
  const editSubTaskHeader = EST_MENU.EDIT_HEADER.split('*')[1]
  const editSubTaskDesc = EST_MENU.EDIT_DESC.split('*')[1]

  switch (command) {
    case inputSubTaskHeader: {
      if (!user.getSubTask().getLinkId()) {
        await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
        await telegramBot.deleteMsg({ msg: response, user, bot })
        return
      }

      let taskData = await getTaskById(user.getSubTask().getLinkId())
      user.getSubTask().setHeader(response.text)
      let taskPhrase = genTaskPhrase({
        credentials: taskData,
        state: CST_MENU.INPUT_STASK_HEADER //'input_subtask_header'
      })

      let subTaskPhrase = genSubTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: CREATE_SUBTASK_KEYBOARD,
        bot
      })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.setState('deleter')
      break
    } case editSubTaskHeader: {
      user.getSubTask().setHeader(response.text)

      const taskData = await getTaskById(user.getSubTask().getLinkId())

      const taskPhrase = genTaskPhrase({ credentials: taskData, state: EST_MENU.EDIT_HEADER })
      const subTaskPhrase = genSubTaskPhrase({ credentials: user })

      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: EDIT_SUBTASK_KEYBOARD,
        bot
      })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.setState('deleter')
      break
    } case editSubTaskDesc: {
      user.getSubTask().setDescription(response.text)

      const taskData = await getTaskById(user.getSubTask().getLinkId())

      const taskPhrase = genTaskPhrase({ credentials: taskData, state: EST_MENU.EDIT_DESC })
      const subTaskPhrase = genSubTaskPhrase({ credentials: user })

      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: EDIT_SUBTASK_KEYBOARD,
        bot
      })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.setState('deleter')
      break
    } case inputSubTaskDesc: {
      if (!user.getSubTask().getLinkId()) {
        await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
        await telegramBot.deleteMsg({ msg: response, user, bot })
        return
      }

      let taskData = await getTaskById(user.getSubTask().getLinkId())

      user.getSubTask().setDescription(response.text)

      let taskPhrase = genTaskPhrase({ credentials: taskData, state: CST_MENU.INPUT_STASK_DESC })
      let subTaskPhrase = genSubTaskPhrase({ credentials: user })

      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: CREATE_SUBTASK_KEYBOARD,
        bot
      })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.setState('deleter')
      break
    } case inputTaskHeader: {
      user.getTask().setHeader(response.text)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.setState('deleter')
      break
    } case editTaskHeader: {
      user.getTask().setHeader(response.text)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: EDIT_TASK_KEYBOARD, bot })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.setState('deleter')
      break
    } case editTaskDesc: {
      user.getTask().setDescription(response.text)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: EDIT_TASK_KEYBOARD, bot })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.setState('deleter')
      break
    } case inputTaskDesc: {
      user.getTask().setDescription(response.text)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.setState('deleter')
      break
    } case 'deleter': {
      await telegramBot.deleteMsg({ msg: response, user, bot })
      break
    } default: {
      let mainKeyboard = deepClone(MAIN_KEYBOARD)
      let adminId = process.env.ADMIN_ID
      let usersActivityBtn = [{
        text: 'Скачать активность юзеров',
        callback_data: `${GA_MENU.GA_COMMAND}`,
      }]
      let adminPanelBtn = [{
        text: 'Админ панель',
        callback_data: `${EAP.EAP_COMMAND}`,
      }]

      let seniorsDepList = await googleSheet.getDataFromSheet({
        tableName: TABLE_NAMES.TABLE_SENIOR_DEP,
        tableRange: TABLE_RANGE.TABLE_SENIOR_DEP_RANGE
      })

      for (let i = 0; i < seniorsDepList.length; i++) {
        if (String(seniorsDepList[i].senior_id) === String(user.getUserId())) {
          mainKeyboard.inline_keyboard.push(adminPanelBtn)
          break
        }
      }

      if (String(adminId) === String(user.getUserId()))
        mainKeyboard.inline_keyboard.push(usersActivityBtn)


      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.sendMessage({ msg: response, phrase, user, keyboard: mainKeyboard, bot })
      user.setState('deleter')
      break;
    }
  }
}