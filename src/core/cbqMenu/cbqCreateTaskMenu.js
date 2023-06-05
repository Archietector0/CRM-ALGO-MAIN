import { db } from "../../db/DataBase.js";
import { Task } from "../../telegram/Task.js";
import { telegramBot } from "../../telegram/TelegramBot.js";
import { CT_MENU, GA_MENU, PHRASES } from "../../telegram/constants/constants.js";
import { BACK_CT_MENU_KEYBOARD, CHOOSE_TASK_PRIORITY_KEYBOARD, CREATE_TASK_KEYBOARD, MAIN_KEYBOARD } from "../../telegram/constants/keyboards.js";
import { genSubTaskPhrase, genTaskPhrase, showAvailabelAsistant, showAvailabelProject, showAvailabelTaskPerformer } from "../cbQueryOperationLogic.js";
import crypto from "crypto";
import { deepClone } from "../helper.js";
import { taskImg } from "../../db/constants/constants.js";


export async function cbqCreateTaskMenu({ response, user, bot }) {
  const command = (user.getState().split('*'))[1];
  
  const createTask = CT_MENU.CT_COMMAND.split('*')[1]
  const inputTaskHeader = CT_MENU.INPUT_TASK_HEADER.split('*')[1]
  const inputTaskDesc = CT_MENU.INPUT_TASK_DESC.split('*')[1]
  const choosePriority = CT_MENU.CHOOSE_PRIORITY.split('*')[1]
  const chosenPriority = CT_MENU.CHOSEN_PRIORITY.split('*')[1]
  const choosePerformer = CT_MENU.CHOOSE_PERFORMER.split('*')[1]
  const chosenPerformer = CT_MENU.CHOSEN_PERFORMER.split('*')[1]

  // const chooseAssistant = CT_MENU.CHOOSE_ASSISTANT.split('*')[1]
  // const chosenAssistant = CT_MENU.CHOSEN_ASSISTANT.split('*')[1]

  const chooseProject = CT_MENU.CHOOSE_PROJECT.split('*')[1]
  const chosenProject = CT_MENU.CHOSEN_PROJECT.split('*')[1]
  const finishTask = CT_MENU.FINISH_TASK.split('*')[1]
  const cancelTask = CT_MENU.CANCEL_TASK.split('*')[1]
  const backCTMenu = CT_MENU.BACK_CT_MENU.split('*')[1]


  switch (command) {
    case createTask: {
      user.setMainMsgId(response.message.message_id)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg:response,
        phrase,
        user,
        keyboard: CREATE_TASK_KEYBOARD,
        bot
      })
      user.setState('deleter')
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
      user.setState('deleter')
      break
    } case chosenPriority: {
      const priorityValue = response.data.split('*')[2]
      user.getTask().setPriority(priorityValue)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase,
        user,
        keyboard: CREATE_TASK_KEYBOARD,
        bot
      })
      user.setState('deleter')
      break
    } 
    
    // case chooseAssistant: {
    //   await showAvailabelAsistant({
    //     response,
    //     phrase: PHRASES.REFINE_ASSISTANT,
    //     user,
    //     bot
    //   })
    //   user.setState('deleter');
    //   break
    // } case chosenAssistant: {
    //   const assistantValue = response.data.split('*')[2]
    //   let taskData = await getTaskById(user.getSubTask().getLinkId())
    //   user.getSubTask().setSenior(assistantValue)
    //   let taskPhrase = genTaskPhrase({
    //     credentials: taskData,
    //     state: CT_MENU.CHOSEN_ASSISTANT
    //   })
    //   let subTaskPhrase = genSubTaskPhrase({ credentials: user })
    //   await telegramBot.editMessage({
    //     msg: response,
    //     phrase: taskPhrase + subTaskPhrase,
    //     user,
    //     keyboard: CREATE_TASK_KEYBOARD,
    //     bot
    //   })
    //   user.setState('deleter');
    //   break
    // } 
    case chooseProject: {
      await showAvailabelProject({
        response,
        phrase: PHRASES.REFINE_PROJECT,
        user,
        bot
      })
      user.setState('deleter')
      break
    } case chosenProject: {
      const projectValue = response.data.split('*')[2]
      user.getTask().setProject(projectValue)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      user.setState('deleter')

      break
    } case choosePerformer: {
      await showAvailabelTaskPerformer({
        response,
        phrase: PHRASES.REFINE_PERFORMER,
        user,
        bot
      })
      user.setState('deleter')
      break
    } case chosenPerformer: {
      const performerValue = response.data.split('*')[2]
      user.getTask().setPerformer(performerValue)
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      user.setState('deleter')
      break
    } case finishTask: {
      // Проверка на заполненность дынных
      if (user.getTask().getProject() === '' ||
          user.getTask().getHeader() === '' ||
          user.getTask().getPriority() === '' ||
          user.getTask().getPerformer() === '' ||
          user.getTask().getSenior() === '') {
        await telegramBot.editMessage({
          msg: response,
          phrase: PHRASES.INCORRECT_INPUT,
          user,
          keyboard: BACK_CT_MENU_KEYBOARD, 
          bot
        })
        user.setState('deleter')
        return
      }

      // Модификация описания
      if (user.getTask().getDescription() === '') user.getTask().setDescription('NOT_SPECIFIED')

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
      log.project_name = user.getTask().getProject()
      log.senior_id = user.getTask().getSenior()
      log.senior_nickname = 'NOT_SPECIFIED'
      log.performer_id = user.getTask().getPerformer()
      log.performer_nickname = 'NOT_SPECIFIED'
      log.task_header = user.getTask().getHeader()
      log.task_desc = user.getTask().getDescription()
      log.task_priority = user.getTask().getPriority()
      log.task_status = 'OPENED'


      try {
        await taskImg.create(log)
      } catch (e) {
        console.log(`ERROR: ${e.message}`);
      }

      user.getTask().setProject('')
      user.getTask().setHeader('')
      user.getTask().setDescription('')
      user.getTask().setPerformer('')
      user.getTask().setPriority('')

      let mainKeyboard = deepClone(MAIN_KEYBOARD)
      let adminId = process.env.ADMIN_ID
      let usersActivityBtn = [{
        text: 'Скачать активность юзеров',
        callback_data: `${GA_MENU.GA_COMMAND}`,
      }]

      if (String(adminId) === String(user.getUserId()))
        mainKeyboard.inline_keyboard.push(usersActivityBtn)

      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({
        msg: response,
        phrase,
        user,
        keyboard: mainKeyboard,
        bot
      })

      user.setState('deleter')
      break
    } case cancelTask: {
      user.setTask(new Task())

      let mainKeyboard = deepClone(MAIN_KEYBOARD)
      let adminId = process.env.ADMIN_ID
      let usersActivityBtn = [{
        text: 'Скачать активность юзеров',
        callback_data: `${GA_MENU.GA_COMMAND}`,
      }]

      if (String(adminId) === String(user.getUserId()))
        mainKeyboard.inline_keyboard.push(usersActivityBtn)
      

      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: mainKeyboard, bot })
      user.setState('deleter')
      break;
    } case backCTMenu: {
      const phrase = genTaskPhrase({ credentials: user })
      
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      user.setState('deleter')
      break
    }
  }
}