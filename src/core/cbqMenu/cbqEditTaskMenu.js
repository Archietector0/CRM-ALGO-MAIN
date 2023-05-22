import { getSubTaskById, getTaskById, updateTaskById } from "../../db/constants/constants.js";
import { Task } from "../../telegram/Task.js";
import { telegramBot } from "../../telegram/TelegramBot.js";
import { ET_MENU, PHRASES, SAG_MENU } from "../../telegram/constants/constants.js";
import { EDIT_TASK_KEYBOARD, EDIT_TASK_PRIORITY_KEYBOARD, EDIT_TASK_STATUS_KEYBOARD, MAIN_KEYBOARD } from "../../telegram/constants/keyboards.js";
import { genTaskPhrase, getBrootForceKeyboard, showAvailabelTaskPerformerEdit } from "../cbQueryOperationLogic.js";

export async function cbqEditTaskMenu({ response, user, bot }) {
  const command = (user.state.split('*'))[1];

  const editTask = ET_MENU.EDIT_TASK.split('*')[1]
  const editHeader = ET_MENU.EDIT_HEADER.split('*')[1]
  const editDesc = ET_MENU.EDIT_DESC.split('*')[1]
  const editPriority = ET_MENU.EDIT_PRIORITY.split('*')[1]
  const chosenPriority = ET_MENU.CHOSEN_PRIORITY.split('*')[1]
  const editPerformer = ET_MENU.EDIT_PERFORMER.split('*')[1]
  const chosenPerformer = ET_MENU.CHOSEN_PERFORMER.split('*')[1]
  const editStatus = ET_MENU.EDIT_STATUS.split('*')[1]
  const chosenStatus = ET_MENU.CHOSEN_STATUS.split('*')[1]

  const finishEditTask = ET_MENU.FINISH_EDIT.split('*')[1]
  const cancelEditTask = ET_MENU.CANCEL_ET.split('*')[1]
  const backEditTaskMenu = ET_MENU.BACK_ET_MENU.split('*')[1]





  switch(command) {
    case editTask: {
      const editTaskLinkId = !response.data.split('*')[2] ? user.subTask.getLinkId() : response.data.split('*')[2]
      const taskData = await getTaskById(editTaskLinkId)
      const phrase = genTaskPhrase({
        credentials: taskData,
        state: ET_MENU.EDIT_TASK
      })

      let newTask = new Task(taskData.senior_id)
      newTask.setProject(taskData.project_name)
      newTask.setHeader(taskData.task_header)
      newTask.setDescription(taskData.task_desc)
      newTask.setPriority(taskData.task_priority)
      newTask.setPerformer(taskData.performer_id)
      newTask.setSenior(taskData.senior_id)
      newTask.setStatus(taskData.task_status)
      newTask.setLinkId(editTaskLinkId)

      user.addTask(newTask)

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
    } case editStatus: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_STATUS,
        user,
        keyboard: EDIT_TASK_STATUS_KEYBOARD,
        bot
      })
      user.state = 'deleter'
      break
    } case chosenStatus: {
      const statusValue = response.data.split('*')[2]
      user.getLastTask().setStatus(statusValue)
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
      const linkId = user.getLastTask().getLinkId()

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
      let subtaskData = await getSubTaskById(linkId)

      let keyboard = await getBrootForceKeyboard({
        data: subtaskData,
        user: taskData,
        sample: SAG_MENU.CHOSEN_STASK,
        createLink: linkId
      })
    
      const phrase = genTaskPhrase({ credentials: taskData, state: SAG_MENU.CHOSEN_TASK })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })

      user.removeLastTask()
      user.state = 'deleter'
      break
    } case finishEditTask: {
      const linkId = user.getLastTask().getLinkId()

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

      await updateTaskById({
        linkId: user.getLastTask().getLinkId(),
        changes: user.getLastTask()
      })

      let taskData = await getTaskById(linkId)
      let subtaskData = await getSubTaskById(linkId)

      let keyboard = await getBrootForceKeyboard({
        data: subtaskData,
        user: taskData,
        sample: SAG_MENU.CHOSEN_STASK,
        createLink: linkId
      })
    
      const phrase = genTaskPhrase({
        credentials: taskData,
        state: SAG_MENU.CHOSEN_TASK
      })
      await telegramBot.editMessage({
        msg: response,
        phrase,
        user,
        keyboard,
        bot
      })

      user.removeLastTask()
      user.state = 'deleter'
      break
    } case chosenPerformer: {
      const performerValue = response.data.split('*')[2]
      user.getLastTask().setPerformer(performerValue)
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
    }
  }

}
