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
  genAssignedGoalKeyboard,
  showAvailabelAsistant,
  showAvailabelPerformer
} from "../cbQueryOperationLogic.js";
import { SubTask } from "../../telegram/SubTask.js";
import { telegramBot } from "../../telegram/TelegramBot.js";
import crypto from "crypto";

export async function cbqCreateSubTaskMenu({ response, user, bot }) {
  const command = (user.getState().split('*'))[1];
  const createSubTask = CST_MENU.CST_COMMAND.split('*')[1]
  const inputSubTaskHeader = CST_MENU.INPUT_STASK_HEADER.split('*')[1]
  const inputSubTaskDesc = CST_MENU.INPUT_STASK_DESC.split('*')[1]
  const chooseSubTaskPriority = CST_MENU.CHOOSE_STASK_PRIORITY.split('*')[1]
  const chosenSubTaskPriority = CST_MENU.CHOSEN_STASK_PRIORITY.split('*')[1]
  const chooseSubTaskPerformer = CST_MENU.CHOOSE_STASK_PERFORMER.split('*')[1]
  const chosenSubTaskPerformer = CST_MENU.CHOSEN_STASK_PERFORMER.split('*')[1]
  const finishSubtask = CST_MENU.FINISH_STASK.split('*')[1]
  const cancelSubTask = CST_MENU.CANCEL_STASK.split('*')[1]
  const backMainMenu = CST_MENU.BACK_MAIN_MENU.split('*')[1]

  if (!user.getTask().getLinkId()) {
    await telegramBot.editMessage({
      msg: response,
      phrase: 'SERVER WAS RESTARTED',
      user,
      keyboard: MAIN_KEYBOARD,
      bot
    })
    user.setState('deleter');
    return
  }

  switch (command) {
    case createSubTask: {
      const linkId = user.getTask().getLinkId()
      let taskData = await getTaskById(linkId)


      let newSubTask = new SubTask()
      newSubTask.setLinkId(linkId)
      newSubTask.setProject(taskData.project_name)
      newSubTask.setSenior(user.getUserId())
      newSubTask.setStatus('OPENED')
      user.setSubTask(newSubTask)

      let taskPhrase = genTaskPhrase({ credentials: taskData, state: MAIN_COMMANDS.CREATE_SUBTASK })
      let subTaskPhrase = genSubTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: CREATE_SUBTASK_KEYBOARD,
        bot
      })
      user.setState('deleter');
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
      user.setState('deleter');
      break
    } case chosenSubTaskPriority: {
      const priorityValue = response.data.split('*')[2]
      let taskData = await getTaskById(user.getSubTask().getLinkId())
      user.getSubTask().setPriority(priorityValue)
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
      user.setState('deleter');
      break
    } case chooseSubTaskPerformer: {
      await showAvailabelPerformer({
        response,
        phrase: PHRASES.REFINE_PERFORMER,
        user,
        bot
      })
      user.setState('deleter');
      break
    } case chosenSubTaskPerformer: {
      const performerValue = response.data.split('*')[2]
      let taskData = await getTaskById(user.getSubTask().getLinkId())
      user.getSubTask().setPerformer(performerValue)
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
      user.setState('deleter');
      break
    } case cancelSubTask: {

      user.getSubTask().setHeader('')
      user.getSubTask().setProject('')
      user.getSubTask().setDescription('')
      user.getSubTask().setPriority('')
      user.getSubTask().setPerformer('')
      user.getSubTask().setSenior('')

      let taskData = await getTaskById(user.getSubTask().getLinkId())
      let subtaskData = await getSubTaskById(user.getSubTask().getLinkId())

      const phrase = genTaskPhrase({
        credentials: taskData,
        state: CST_MENU.CANCEL_STASK
      })
      
      let keyboard = await genAssignedGoalKeyboard({
        data: subtaskData,
        user: taskData,
        sample: SAG_MENU.CHOSEN_STASK,
        createLink: user.getSubTask().getLinkId(),
        session: user
      })
      
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })
      user.setState('deleter');
      break;

    } case finishSubtask: {
      console.log('Project: ', user.getSubTask().getProject());

      if (
        user.getSubTask().getHeader() === '' ||
        user.getSubTask().getPriority() === '' ||
        user.getSubTask().getSenior() === '' ||
        user.getSubTask().getPerformer() === ''
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
        user.setState('deleter')
        return
      }


      if (user.getSubTask().getDescription() === '')
        user.getSubTask().setDescription('NOT_SPECIFIED')

      const log = {
        uuid: '',
        link_id: '',
        project_name: '',
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
      log.link_id = user.getSubTask().getLinkId()
      log.project_name = user.getSubTask().getProject()
      log.created_at = (new Date()).toISOString()
      log.senior_id = user.getSubTask().getSenior()
      log.senior_nickname = 'NOT_SPECIFIED'
      log.performer_id = user.getSubTask().getPerformer()
      log.performer_nickname = 'NOT_SPECIFIED'
      log.subtask_header = user.getSubTask().getHeader()
      log.subtask_desc = user.getSubTask().getDescription()
      log.subtask_priority = user.getSubTask().getPriority()
      log.subtask_status = 'OPENED'

      try {
        await subTaskImg.create(log)
      } catch (e) {
        console.log(`ERROR: ${e.message}`);
      }

      user.getSubTask().setHeader('')
      user.getSubTask().setProject('')
      user.getSubTask().setDescription('')
      user.getSubTask().setPriority('')
      user.getSubTask().setSenior('')
      user.getSubTask().setPerformer('')

      let taskData = await getTaskById(user.getSubTask().getLinkId())
      let subtaskData = await getSubTaskById(user.getSubTask().getLinkId())

      let taskPhrase = genTaskPhrase({
        credentials: taskData,
        state: CST_MENU.FINISH_STASK
      })

      let keyboard = await genAssignedGoalKeyboard({
        data: subtaskData,
        user: taskData,
        sample: SAG_MENU.CHOSEN_STASK,
        createLink: user.getSubTask().getLinkId(),
        session: user
      })
      
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase,
        user,
        keyboard,
        bot
      })

      user.setState('deleter')
      break
    } case backMainMenu: {
      let taskData = await getTaskById(user.getSubTask().getLinkId())
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
      user.setState('deleter');
      break
    }
  }
}
