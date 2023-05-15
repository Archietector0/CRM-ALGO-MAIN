import { db } from "../../db/DataBase.js";
import { telegramBot } from "../../telegram/TelegramBot.js";
import { CT_MENU, PHRASES } from "../../telegram/constants/constants.js";
import { BACK_CT_MENU_KEYBOARD, CHOOSE_TASK_PRIORITY_KEYBOARD, CREATE_TASK_KEYBOARD, MAIN_KEYBOARD } from "../../telegram/constants/keyboards.js";
import { genTaskPhrase, showAvailabelProject, showAvailabelTaskPerformer } from "../cbQueryOperationLogic.js";
import crypto from "crypto";

const taskConn = db.getConnection({
  DB_NAME: process.env.DB_TASK_NAME,
  DB_USERNAME: process.env.DB_TASK_USERNAME,
  DB_PASS: process.env.DB_TASK_PASS,
  DB_DIALECT: process.env.DB_TASK_DIALECT,
  DB_HOST: process.env.DB_TASK_HOST,
  DB_PORT: process.env.DB_TASK_PORT
})
const taskImg = db.getImage({ sequelize: taskConn, modelName: process.env.DB_TASK_TABLE_NAME })

export async function cbqCreateTaskMenu({ response, user, bot }) {
  const command = (user.state.split('*'))[1];
  
  const createTask = CT_MENU.CT_COMMAND.split('*')[1]
  const inputTaskHeader = CT_MENU.INPUT_TASK_HEADER.split('*')[1]
  const inputTaskDesc = CT_MENU.INPUT_TASK_DESC.split('*')[1]
  const choosePriority = CT_MENU.CHOOSE_PRIORITY.split('*')[1]
  const chosenPriority = CT_MENU.CHOSEN_PRIORITY.split('*')[1]
  const choosePerformer = CT_MENU.CHOOSE_PERFORMER.split('*')[1]
  const chosenPerformer = CT_MENU.CHOSEN_PERFORMER.split('*')[1]
  const chooseProject = CT_MENU.CHOOSE_PROJECT.split('*')[1]
  const chosenProject = CT_MENU.CHOSEN_PROJECT.split('*')[1]
  const finishTask = CT_MENU.FINISH_TASK.split('*')[1]
  const cancelTask = CT_MENU.CANCEL_TASK.split('*')[1]
  const backCTMenu = CT_MENU.BACK_CT_MENU.split('*')[1]


  switch (command) {
    case createTask: {
      user.mainMsgId = response.message.message_id
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({ msg:
        response,
        phrase,
        user,
        keyboard: CREATE_TASK_KEYBOARD,
        bot
      })
      user.state = 'deleter'
      break
    } case inputTaskHeader: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_HEADER,
        user,
        bot
      })
      break
    } case inputTaskDesc: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_DESC,
        user,
        bot
      })
      break
    } case choosePriority: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_PRIORITY,
        user,
        keyboard: CHOOSE_TASK_PRIORITY_KEYBOARD,
        bot
      })
      user.state = 'deleter'
      break
    } case chosenPriority: {
      const priorityValue = response.data.split('*')[2]
      user.getLastTask().setPriority(priorityValue)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase,
        user,
        keyboard: CREATE_TASK_KEYBOARD,
        bot
      })
      user.state = 'deleter';
      break
    } case chooseProject: {
      await showAvailabelProject({
        response,
        phrase: PHRASES.REFINE_PROJECT,
        user,
        bot
      })
      user.state = 'deleter'
      break
    } case chosenProject: {
      const projectValue = response.data.split('*')[2]
      user.getLastTask().setProject(projectValue)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      user.state = 'deleter';
      break
    } case choosePerformer: {
      await showAvailabelTaskPerformer({
        response,
        phrase: PHRASES.REFINE_PERFORMER,
        user,
        bot
      })
      user.state = 'deleter'
      break
    } case chosenPerformer: {
      const performerValue = response.data.split('*')[2]
      user.getLastTask().setPerformer(performerValue)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      user.state = 'deleter';
      break
    } case finishTask: {
      // Проверка на заполненность дынных
      if (user.getLastTask().getProject() === '' ||
          user.getLastTask().getHeader() === '' ||
          user.getLastTask().getPriority() === '' ||
          user.getLastTask().getSenior() === '') {
        await telegramBot.editMessage({
          msg: response,
          phrase: PHRASES.INCORRECT_INPUT,
          user,
          keyboard: BACK_CT_MENU_KEYBOARD, 
          bot
        })
        user.state = 'deleter'
        return
      }

      // Модификация описания
      if (user.getLastTask().getDescription() === '') user.getLastTask().setDescription('NOT_SPECIFIED')

      const log = {
        uuid: '',
        link_id: '',
        created_at: '',
        project_name: '',
        senior_id: '',
        senior_nickname: '',
        performer_id: '',
        performer_nickname: '',
        task_header: '',
        task_desc: '',
        task_priority: '',
        task_status: '',
      }

      log.uuid = crypto.randomUUID()
      log.link_id = crypto.randomUUID()
      log.created_at = (new Date()).toISOString()
      log.project_name = user.getLastTask().getProject()
      log.senior_id = user.getLastTask().getSenior()
      log.senior_nickname = 'NOT_SPECIFIED'
      log.performer_id = user.getLastTask().getPerformer()
      log.performer_nickname = 'NOT_SPECIFIED'
      log.task_header = user.getLastTask().getHeader()
      log.task_desc = user.getLastTask().getDescription()
      log.task_priority = user.getLastTask().getPriority()
      log.task_status = 'OPENED'


      try {
        await taskImg.create(log)
      } catch (e) {
        console.log(`ERROR: ${e.message}`);
      }

      user.getLastTask().setProject('')
      user.getLastTask().setHeader('')
      user.getLastTask().setDescription('')
      user.getLastTask().setPriority('')

      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({
        msg: response,
        phrase,
        user,
        keyboard: MAIN_KEYBOARD,
        bot
      })

      user.state = 'deleter'
      break
    } case cancelTask: {
      user.getLastTask().setProject('')
      user.getLastTask().setHeader('')
      user.getLastTask().setDescription('')
      user.getLastTask().setPriority('')

      if (user.getAllTasks().length > 1) 
        user.removeLastTask()

      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: MAIN_KEYBOARD, bot })
      user.state = 'deleter';
      break;
    } case backCTMenu: {
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${user.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${user.getLastTask().getHeader()}\nОписание:\n\t\t\t${user.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${user.getLastTask().getPriority()}\nИсполнитель:\n\t\t${user.getLastTask().getPerformer()}\nСоздатель:\n\t\t\t${user.getLastTask().getSenior()}\nСтатус:\n\t\t\t${user.getLastTask().getStatus()}\n--------------------------------\n`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      user.state = 'deleter'
      break
    }
  }
}