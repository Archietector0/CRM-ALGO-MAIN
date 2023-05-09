import { telegramBot } from "../telegram/TelegramBot.js";
import { CREATE_SUBTASK_KEYBOARD, CREATE_TASK_KEYBOARD, MAIN_KEYBOARD } from "../telegram/constants/keyboards.js";
import { db } from '../db/DataBase.js'
import { QueryTypes } from "sequelize";

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
  switch (user.state) {
    case 'input_subtask_header': {
      if (!user.subTask) {
        await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
        await telegramBot.deleteMsg({ msg: response, user, bot })
        return
      }

      let taskData = (await taskConn.query(`
      SELECT
        *
      FROM
        task_storage
      WHERE
        uuid = '${user.subTask.getLinkId()}'
      `, {type: QueryTypes.SELECT }))[0]

      user.subTask.setHeader(response.text)
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОсновная задача\n--------------------------------\nПроект:\n\t\t\t${taskData.project_name}\nЗаголовок:\n\t\t\t${taskData.task_header}\nОписание:\n\t\t\t${taskData.task_description}\nПриоритет:\n\t\t\t${taskData.task_priority}\nОтветсвенный:\n\t\t\t${taskData.senior_id}\n--------------------------------\nСоздание субтаски:\n--------------------------------\nЗаголовок:\n\t\t\t${user.subTask.getHeader()}\nОписание:\n\t\t\t${user.subTask.getDescription()}\nПриоритет:\n\t\t\t${user.subTask.getPriority()}\nАсистент:\n\t\t\t${user.subTask.getAssistant()}\nИсполнитель:\n\t\t\t${user.subTask.getPerformer()}\n`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_SUBTASK_KEYBOARD, bot })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.state = 'deleter'
      break
    } case 'input_subtask_description': {
      if (!user.subTask) {
        await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
        await telegramBot.deleteMsg({ msg: response, user, bot })
        return
      }
      let taskData = (await taskConn.query(`
      SELECT
        *
      FROM
        task_storage
      WHERE
        uuid = '${user.subTask.getLinkId()}'
      `, {type: QueryTypes.SELECT }))[0]

      user.subTask.setDescription(response.text)
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОсновная задача\n--------------------------------\nПроект:\n\t\t\t${taskData.project_name}\nЗаголовок:\n\t\t\t${taskData.task_header}\nОписание:\n\t\t\t${taskData.task_description}\nПриоритет:\n\t\t\t${taskData.task_priority}\nОтветсвенный:\n\t\t\t${taskData.senior_id}\n--------------------------------\nСоздание субтаски:\n--------------------------------\nЗаголовок:\n\t\t\t${user.subTask.getHeader()}\nОписание:\n\t\t\t${user.subTask.getDescription()}\nПриоритет:\n\t\t\t${user.subTask.getPriority()}\nАсистент:\n\t\t\t${user.subTask.getAssistant()}\nИсполнитель:\n\t\t\t${user.subTask.getPerformer()}\n`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_SUBTASK_KEYBOARD, bot })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.state = 'deleter'
      break
    } case 'input_header': {
      user.getLastTask().setHeader(response.text)
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${user.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${user.getLastTask().getHeader()}\nОписание:\n\t\t\t${user.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${user.getLastTask().getPriority()}\nОтветсвенный:\n\t\t\t${user.getLastTask().getSenior()}\n--------------------------------\n`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.state = 'deleter'
      break
    } case 'input_description': {
      user.getLastTask().setDescription(response.text)
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${user.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${user.getLastTask().getHeader()}\nОписание:\n\t\t\t${user.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${user.getLastTask().getPriority()}\nОтветсвенный:\n\t\t\t${user.getLastTask().getSenior()}\n--------------------------------\n`
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