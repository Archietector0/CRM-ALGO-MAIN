import { getTaskById } from "../../db/constants/constants.js";
import { telegramBot } from "../../telegram/TelegramBot.js";
import { ET_MENU, PHRASES } from "../../telegram/constants/constants.js";
import { EDIT_TASK_KEYBOARD, EDIT_TASK_PRIORITY_KEYBOARD } from "../../telegram/constants/keyboards.js";
import { genTaskPhrase, showAvailabelTaskPerformerEdit } from "../cbQueryOperationLogic.js";

export async function cbqEditTaskMenu({ response, user, bot }) {
  const command = (user.state.split('*'))[1];

  const editTask = ET_MENU.EDIT_TASK.split('*')[1]
  const editHeader = ET_MENU.EDIT_HEADER.split('*')[1]
  const editDesc = ET_MENU.EDIT_DESC.split('*')[1]
  const editPriority = ET_MENU.EDIT_PRIORITY.split('*')[1]
  const chosenPriority = ET_MENU.CHOSEN_PRIORITY.split('*')[1]
  const editPerformer = ET_MENU.EDIT_PERFORMER.split('*')[1]

  const cancelEditTask = ET_MENU.CANCEL_ET.split('*')[1]
  const backEditTaskMenu = ET_MENU.BACK_ET_MENU.split('*')[1]





  switch(command) {
    case editTask: {
      const editTaskLinkId = response.data.split('*')[2]
      const taskData = await getTaskById(editTaskLinkId)
      const phrase = genTaskPhrase({
        credentials: taskData,
        state: ET_MENU.EDIT_TASK
      })
      await telegramBot.editMessage({
        msg: response,
        phrase,
        user,
        keyboard: EDIT_TASK_KEYBOARD,
        bot
      })
      user.state = 'deleter'
      break
    } case editHeader: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_HEADER,
        user,
        bot
      })
      break
    } case editDesc: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_DESC,
        user,
        bot
      })
      break
    } case editPriority: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_PRIORITY,
        user,
        keyboard: EDIT_TASK_PRIORITY_KEYBOARD,
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
        keyboard: EDIT_TASK_KEYBOARD,
        bot
      })
      user.state = 'deleter'
      break
    } case editPerformer: {
      await showAvailabelTaskPerformerEdit({
        response,
        phrase: PHRASES.REFINE_PERFORMER,
        user,
        bot
      })
      user.state = 'deleter'
      break
    } case backEditTaskMenu: {
      const phrase = genTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase,
        user,
        keyboard: EDIT_TASK_KEYBOARD,
        bot
      })
      user.state = 'deleter'
      break
    } case cancelEditTask: {

      // user.removeLastTask()
      // const linkId = user.getLastTask().getLinkId()

      // let taskData = await getTaskById(linkId)
      // let subtaskData = await getSubTaskById(linkId)

      // let keyboard = await getBrootForceKeyboard({
      //   data: subtaskData,
      //   user: taskData,
      //   sample: SAG_MENU.CHOSEN_STASK,
      //   createLink: linkId
      // })
    
      // const phrase = genTaskPhrase({ credentials: taskData, state: 'chosen_task' })
      // await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })

      // let newTask = new Task(taskData.senior_id)
      // newTask.setProject(taskData.project_name)
      // newTask.setHeader(taskData.task_header)
      // newTask.setDescription(taskData.task_desc)
      // newTask.setPriority(taskData.task_priority)
      // newTask.setPerformer(taskData.performer_id)
      // newTask.setSenior(taskData.senior_id)
      // newTask.setStatus(taskData.task_status)
      // newTask.setLinkId(linkId)


      // user.addTask(newTask)


      // user.state = 'deleter'
      break
    }
  }

}
