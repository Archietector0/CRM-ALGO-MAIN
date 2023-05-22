import {
  getSubTaskById,
  getTaskById,
  subTaskImg
} from "../../db/constants/constants.js";
import {
  CST_MENU,
  MAIN_COMMANDS,
  PHRASES,
  SAG_MENU
} from "../../telegram/constants/constants.js";
import {
  CHOOSE_SUBTASK_PRIORITY_KEYBOARD,
  CREATE_SUBTASK_KEYBOARD,
  MAIN_KEYBOARD
} from "../../telegram/constants/keyboards.js";
import {
  genSubTaskPhrase,
  genTaskPhrase,
  getBrootForceKeyboard,
  showAvailabelAsistant,
  showAvailabelPerformer
} from "../cbQueryOperationLogic.js";
import { SubTask } from "../../telegram/SubTask.js";
import { telegramBot } from "../../telegram/TelegramBot.js";
import crypto from "crypto";



export async function cbqCreateSubTaskMenu({ response, user, bot }) {
  const command = (user.state.split('*'))[1];
  const createSubTask = CST_MENU.CST_COMMAND.split('*')[1]
  const inputSubTaskHeader = CST_MENU.INPUT_STASK_HEADER.split('*')[1]
  const inputSubTaskDesc = CST_MENU.INPUT_STASK_DESC.split('*')[1]
  const chooseSubTaskPriority = CST_MENU.CHOOSE_STASK_PRIORITY.split('*')[1]
  const chosenSubTaskPriority = CST_MENU.CHOSEN_STASK_PRIORITY.split('*')[1]
  const chooseSubTaskPerformer = CST_MENU.CHOOSE_STASK_PERFORMER.split('*')[1]
  const chosenSubTaskPerformer = CST_MENU.CHOSEN_STASK_PERFORMER.split('*')[1]
  const chooseSubTaskAssistant = CST_MENU.CHOOSE_STASK_ASSISTANT.split('*')[1]
  const chosenSubTaskAssistant = CST_MENU.CHOSEN_STASK_ASSISTANT.split('*')[1]
  const finishSubtask = CST_MENU.FINISH_STASK.split('*')[1]
  const cancelSubTask = CST_MENU.CANCEL_STASK.split('*')[1]
  const backMainMenu = CST_MENU.BACK_MAIN_MENU.split('*')[1]


  switch (command) {
    case createSubTask: {
      const linkId = response.data.split('*')[2]
      if (!linkId) {
        await telegramBot.editMessage({
          msg: response,
          phrase: 'SERVER WAS RESTARTED',
          user,
          keyboard: MAIN_KEYBOARD,
          bot
        })
        return
      }
      let taskData = await getTaskById(linkId)
      user.subTask = new SubTask(linkId)
      let taskPhrase = genTaskPhrase({ credentials: taskData, state: MAIN_COMMANDS.CREATE_SUBTASK })
      let subTaskPhrase = genSubTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: CREATE_SUBTASK_KEYBOARD,
        bot
      })
      user.state = 'deleter';
      break
    } case inputSubTaskHeader: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_HEADER,
        user,
        bot
      })
      break
    } case inputSubTaskDesc: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_DESC,
        user,
        bot
      })
      break
    } case chooseSubTaskPriority: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_PRIORITY,
        user,
        keyboard: CHOOSE_SUBTASK_PRIORITY_KEYBOARD,
        bot
      })
      user.state = 'deleter'
      break
    } case chosenSubTaskPriority: {
      const priorityValue = response.data.split('*')[2]
      if (!user.subTask) {
        await telegramBot.editMessage({
          msg: response,
          phrase: 'SERVER WAS RESTARTED',
          user,
          keyboard: MAIN_KEYBOARD,
          bot
        })
        return
      }
      let taskData = await getTaskById(user.subTask.getLinkId())
      user.subTask.setPriority(priorityValue)
      let taskPhrase = genTaskPhrase({
        credentials: taskData,
        state: CST_MENU.CHOSEN_STASK_PRIORITY
      })
      let subTaskPhrase = genSubTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: CREATE_SUBTASK_KEYBOARD,
        bot
      })
      user.state = 'deleter';
      break
    } case chooseSubTaskPerformer: {
      await showAvailabelPerformer({
        response,
        phrase: PHRASES.REFINE_PERFORMER,
        user,
        bot
      })
      user.state = 'deleter'
      break
    } case chosenSubTaskPerformer: {
      const performerValue = response.data.split('*')[2]
      if (!user.subTask) {
        await telegramBot.editMessage({
          msg: response,
          phrase: 'SERVER WAS RESTARTED',
          user,
          keyboard: MAIN_KEYBOARD,
          bot
        })
        return
      }
      let taskData = await getTaskById(user.subTask.getLinkId())
      user.subTask.setPerformer(performerValue)
      let taskPhrase = genTaskPhrase({
        credentials: taskData,
        state: CST_MENU.CHOSEN_STASK_PERFORMER
      })
      let subTaskPhrase = genSubTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: CREATE_SUBTASK_KEYBOARD,
        bot
      })
      user.state = 'deleter';
      break
    } case chooseSubTaskAssistant: {
      console.log('NONE');
      await showAvailabelAsistant({
        response,
        phrase: PHRASES.REFINE_ASSISTANT,
        user,
        bot
      })
      user.state = 'deleter'
      break
    } case chosenSubTaskAssistant: {
      const assistantValue = response.data.split('*')[2]
      if (!user.subTask) {
        await telegramBot.editMessage({
          msg: response,
          phrase: 'SERVER WAS RESTARTED',
          user,
          keyboard: MAIN_KEYBOARD,
          bot
        })
        return
      }
      let taskData = await getTaskById(user.subTask.getLinkId())
      user.subTask.setSenior(assistantValue)
      let taskPhrase = genTaskPhrase({
        credentials: taskData,
        state: CST_MENU.CHOSEN_STASK_ASSISTANT
      })
      let subTaskPhrase = genSubTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: CREATE_SUBTASK_KEYBOARD,
        bot
      })
      user.state = 'deleter';
      break
    } case cancelSubTask: {
      if (!user.subTask) {
        await telegramBot.editMessage({
          msg: response,
          phrase: 'SERVER WAS RESTARTED',
          user,
          keyboard: MAIN_KEYBOARD,
          bot
        })
        return
      }

      user.subTask.setHeader('')
      user.subTask.setDescription('')
      user.subTask.setPriority('')
      user.subTask.setPerformer('')
      user.subTask.setSenior('')

      let taskData = await getTaskById(user.subTask.getLinkId())
      let subtaskData = await getSubTaskById(user.subTask.getLinkId())

      const phrase = genTaskPhrase({
        credentials: taskData,
        state: CST_MENU.CANCEL_STASK
      })
      
      let keyboard = await getBrootForceKeyboard({
        data: subtaskData,
        user: taskData,
        sample: SAG_MENU.CHOSEN_STASK,
        createLink: user.subTask.getLinkId()
      })
      
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })
      user.state = 'deleter';
      break;

    } case finishSubtask: {
      if (!user.subTask) {
        await telegramBot.editMessage({
          msg: response,
          phrase: 'SERVER WAS RESTARTED',
          user,
          keyboard: MAIN_KEYBOARD,
          bot
        })
        return
      }

      if (
        user.subTask.getHeader() === '' ||
        user.subTask.getPriority() === '' ||
        user.subTask.getSenior() === '' ||
        user.subTask.getPerformer() === ''
      ) {

        const keyboard = {
          inline_keyboard: [[{
            text: 'Назад',
            callback_data: CST_MENU.BACK_MAIN_MENU,
          }]],
        }

        await telegramBot.editMessage({
          msg: response,
          phrase: PHRASES.INCORRECT_INPUT,
          user,
          keyboard,
          bot
        })
        user.state = 'deleter'
        return
      }

      if (user.subTask.getDescription() === '')
        user.getLastTask().setDescription('NOT_SPECIFIED')

      const log = {
        uuid: '',
        link_id: '',
        created_at: '',
        senior_id: '',
        senior_nickname: '',
        performer_id: '',
        performer_nickname: '',
        subtask_header: '',
        subtask_desc: '',
        subtask_priority: '',
        subtask_status: '',
      }

      log.uuid = crypto.randomUUID()
      log.link_id = user.subTask.getLinkId()
      log.created_at = (new Date()).toISOString()
      log.senior_id = user.subTask.getSenior()
      log.senior_nickname = 'NOT_SPECIFIED'
      log.performer_id = user.subTask.getPerformer()
      log.performer_nickname = 'NOT_SPECIFIED'
      log.subtask_header = user.subTask.getHeader()
      log.subtask_desc = user.subTask.getDescription()
      log.subtask_priority = user.subTask.getPriority()
      log.subtask_status = 'OPENED'


      try {
        await subTaskImg.create(log)
      } catch (e) {
        console.log(`ERROR: ${e.message}`);
      }

      user.subTask.setHeader('')
      user.subTask.setDescription('')
      user.subTask.setPriority('')
      user.subTask.setSenior('')
      user.subTask.setPerformer('')

      let taskData = await getTaskById(user.subTask.getLinkId())
      let subtaskData = await getSubTaskById(user.subTask.getLinkId())

      let taskPhrase = genTaskPhrase({
        credentials: taskData,
        state: CST_MENU.FINISH_STASK
      })

      let keyboard = await getBrootForceKeyboard({
        data: subtaskData,
        user: taskData,
        sample: SAG_MENU.CHOSEN_STASK,
        createLink: user.subTask.getLinkId()
      })
      
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase,
        user,
        keyboard,
        bot
      })

      user.state = 'deleter'
      break
    } case backMainMenu: {
      if (!user.subTask) {
        await telegramBot.editMessage({
          msg: response,
          phrase: 'SERVER WAS RESTARTED',
          user,
          keyboard: MAIN_KEYBOARD,
          bot
        })
        return
      }
      let taskData = await getTaskById(user.subTask.getLinkId())
      let taskPhrase = genTaskPhrase({
        credentials: taskData,
        state: CST_MENU.CHOSEN_STASK_ASSISTANT
      })
      let subTaskPhrase = genSubTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: CREATE_SUBTASK_KEYBOARD,
        bot
      })
      user.state = 'deleter';
      break
    }
  }
}
