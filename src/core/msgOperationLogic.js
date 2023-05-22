import { telegramBot } from "../telegram/TelegramBot.js";
import { CREATE_SUBTASK_KEYBOARD, CREATE_TASK_KEYBOARD, EDIT_SUBTASK_KEYBOARD, EDIT_TASK_KEYBOARD, MAIN_KEYBOARD } from "../telegram/constants/keyboards.js";
import { db } from '../db/DataBase.js'
import { QueryTypes } from "sequelize";
import { genSubTaskPhrase, genTaskPhrase } from "./cbQueryOperationLogic.js";
import { CST_MENU, CT_MENU, EST_MENU, ET_MENU } from "../telegram/constants/constants.js";
import { getTaskById } from "../db/constants/constants.js";
import { deepClone } from "./helper.js";

const taskConn = db.getConnection({
  DB_NAME: process.env.DB_TASK_NAME,
  DB_USERNAME: process.env.DB_TASK_USERNAME,
  DB_PASS: process.env.DB_TASK_PASS,
  DB_DIALECT: process.env.DB_TASK_DIALECT,
  DB_HOST: process.env.DB_TASK_HOST,
  DB_PORT: process.env.DB_TASK_PORT
})
const taskImg = db.getImage({ sequelize: taskConn, modelName: process.env.DB_TASK_TABLE_NAME })


const subTaskConn = db.getConnection({
  DB_NAME: process.env.DB_SUBTASK_NAME,
  DB_USERNAME: process.env.DB_SUBTASK_USERNAME,
  DB_PASS: process.env.DB_SUBTASK_PASS,
  DB_DIALECT: process.env.DB_SUBTASK_DIALECT,
  DB_HOST: process.env.DB_SUBTASK_HOST,
  DB_PORT: process.env.DB_SUBTASK_PORT
})
const subTaskImg = db.getImage({ sequelize: subTaskConn, modelName: process.env.DB_SUBTASK_TABLE_NAME })

export async function processingMessageOperationLogic({ response, user, bot }) {
  const command = (user.state.split('*')).length >= 2 ? (user.state.split('*'))[1] : user.state;
  const inputTaskHeader = CT_MENU.INPUT_TASK_HEADER.split('*')[1]
  const inputTaskDesc = CT_MENU.INPUT_TASK_DESC.split('*')[1]
  const inputSubTaskHeader = CST_MENU.INPUT_STASK_HEADER.split('*')[1]
  const inputSubTaskDesc = CST_MENU.INPUT_STASK_DESC.split('*')[1]
  
  const editTaskHeader = ET_MENU.EDIT_HEADER.split('*')[1]
  const editTaskDesc = ET_MENU.EDIT_DESC.split('*')[1]

  const editSubTaskHeader = EST_MENU.EDIT_HEADER.split('*')[1]
  const editSubTaskDesc = EST_MENU.EDIT_DESC.split('*')[1]

  console.log("command ", command);
  console.log("editSubTaskHeader ", editSubTaskHeader);

  switch (command) {
    case inputSubTaskHeader: {
      if (!user.subTask) {
        await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
        await telegramBot.deleteMsg({ msg: response, user, bot })
        return
      }

      let taskData = await getTaskById(user.subTask.getLinkId())

      user.subTask.setHeader(response.text)

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
      user.state = 'deleter'
      break
    } case editSubTaskHeader: {
      user.subTask.setHeader(response.text)

      const taskData = await getTaskById(user.subTask.getLinkId())

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
      user.state = 'deleter'
      break
    } case editSubTaskDesc: {
      user.subTask.setDescription(response.text)

      const taskData = await getTaskById(user.subTask.getLinkId())

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
      user.state = 'deleter'
      break
    } case inputSubTaskDesc: {
      if (!user.subTask) {
        await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
        await telegramBot.deleteMsg({ msg: response, user, bot })
        return
      }

      let taskData = await getTaskById(user.subTask.getLinkId())

      user.subTask.setDescription(response.text)

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
      user.state = 'deleter'
      break
    } case inputTaskHeader: {
      user.getLastTask().setHeader(response.text)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.state = 'deleter'
      break
    } case editTaskHeader: {
      user.getLastTask().setHeader(response.text)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: EDIT_TASK_KEYBOARD, bot })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.state = 'deleter'
      break
    } case editTaskDesc: {
      user.getLastTask().setDescription(response.text)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: EDIT_TASK_KEYBOARD, bot })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.state = 'deleter'
      break
    } case inputTaskDesc: {
      user.getLastTask().setDescription(response.text)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.state = 'deleter'
      break
    } case 'deleter': {
      await telegramBot.deleteMsg({ msg: response, user, bot })
      break
    } default: {
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.sendMessage({ msg: response, phrase, user, keyboard: MAIN_KEYBOARD, bot })
      user.state = 'deleter'
      break;
    }
  }
}