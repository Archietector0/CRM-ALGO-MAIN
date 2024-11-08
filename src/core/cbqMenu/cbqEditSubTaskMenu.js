import { getSubTaskById, getSubTaskByUuid, getTaskById, updateSubTaskById } from "../../db/constants/constants.js";
import { SubTask } from "../../telegram/SubTask.js";
import { telegramBot } from "../../telegram/TelegramBot.js";
import { EST_MENU, NOTIFICATION, PHRASES, SAG_MENU } from "../../telegram/constants/constants.js";
import { EDIT_SUBTASK_KEYBOARD, EDIT_SUBTASK_PRIORITY_KEYBOARD, EDIT_SUBTASK_STATUS_KEYBOARD, MAIN_KEYBOARD } from "../../telegram/constants/keyboards.js";
import { genSubTaskPhrase, genTaskPhrase, genAssignedGoalKeyboard, showAvailabelPerformerEdit, showAvailabelTaskPerformerEdit } from "../cbQueryOperationLogic.js";
import { deepClone } from "../helper.js";

export async function cbqEditSubTaskMenu({ response, user, bot }) {
  const command = (user.getState().split('*'))[1];

  const editSubTask = EST_MENU.EDIT_STASK.split('*')[1]
  const editSubTaskHeader = EST_MENU.EDIT_HEADER.split('*')[1]
  const editSubTaskDesc = EST_MENU.EDIT_DESC.split('*')[1]
  const editSubTaskPriority = EST_MENU.EDIT_PRIORITY.split('*')[1]
  const chosenSubTaskPriority = EST_MENU.CHOSEN_PRIORITY.split('*')[1]
  const editSubTaskStatus = EST_MENU.EDIT_STATUS.split('*')[1]
  const chosenSubTaskStatus = EST_MENU.CHOSEN_STATUS.split('*')[1]
  const editSubTaskPerformer = EST_MENU.EDIT_PERFORMER.split('*')[1]
  const chosenSubTaskPerformer = EST_MENU.CHOSEN_PERFORMER.split('*')[1]

  const finishEditSubTask = EST_MENU.FINISH_EDIT.split('*')[1]
  const backEditSubTask = EST_MENU.BACK_EST_MENU.split('*')[1]
  const cancelEditSubTask = EST_MENU.CANCEL_EST.split('*')[1]

  if (!user.getSubTask().getLinkId() && command !== editSubTask) {
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
    case editSubTask: {
      const editSubTaskUuid = user.subTaskUuid

      if (!editSubTaskUuid) {
        await telegramBot.editMessage({
          msg: response,
          phrase: 'SERVER WAS RESTARTED',
          user,
          keyboard: MAIN_KEYBOARD,
          bot
        })
        return
      }

      const subTaskData = await getSubTaskByUuid(editSubTaskUuid)
      const taskData = await getTaskById(subTaskData.link_id)

      const taskPhrase = genTaskPhrase({
        credentials: taskData,
        state: EST_MENU.EDIT_STASK
      })

      let newSubTask = new SubTask()
      newSubTask.setLinkId(taskData.link_id)
      newSubTask.setProject(subTaskData.project_name)
      newSubTask.setHeader(subTaskData.subtask_header)
      newSubTask.setDescription(subTaskData.subtask_desc)
      newSubTask.setPriority(subTaskData.subtask_priority)
      newSubTask.setPerformer(subTaskData.performer_id)
      newSubTask.setSenior(subTaskData.senior_id)
      newSubTask.setStatus(subTaskData.subtask_status)
      newSubTask.uuid = editSubTaskUuid

      user.setSubTask(newSubTask)

      const subTaskPhrase = genSubTaskPhrase({ credentials: user })

      let editSubTaskKeyboard = deepClone(EDIT_SUBTASK_KEYBOARD)

      editSubTaskKeyboard.inline_keyboard[3][1].callback_data += `*${editSubTaskUuid}`

      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: editSubTaskKeyboard,
        bot
      })

      user.setState('deleter')
      break
    } case editSubTaskHeader: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_HEADER,
        user,
        bot
      })
      break
    } case editSubTaskDesc: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_DESC,
        user,
        bot
      })
      break
    } case editSubTaskPriority: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_PRIORITY,
        user,
        keyboard: EDIT_SUBTASK_PRIORITY_KEYBOARD,
        bot
      })
      user.setState('deleter')
      break
    } case chosenSubTaskPriority: {
      const priorityValue = response.data.split('*')[2]
      user.getSubTask().setPriority(priorityValue)

      const taskData = await getTaskById(user.getSubTask().getLinkId())

      const taskPhrase = genTaskPhrase({ credentials: taskData, state: EST_MENU.CHOSEN_PRIORITY })
      const subTaskPhrase = genSubTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: EDIT_SUBTASK_KEYBOARD,
        bot
      })
      user.setState('deleter')
      break
    } case editSubTaskStatus: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_STATUS,
        user,
        keyboard: EDIT_SUBTASK_STATUS_KEYBOARD,
        bot
      })
      user.setState('deleter')
      break
    } case chosenSubTaskStatus: {
      const statusValue = response.data.split('*')[2]
      user.getSubTask().setStatus(statusValue)

      const taskData = await getTaskById(user.getSubTask().getLinkId())

      const taskPhrase = genTaskPhrase({ credentials: taskData, state: EST_MENU.CHOSEN_STATUS })
      const subTaskPhrase = genSubTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: EDIT_SUBTASK_KEYBOARD,
        bot
      })
      user.setState('deleter')
      break
    } case editSubTaskPerformer: {
      await showAvailabelPerformerEdit({
        response,
        phrase: PHRASES.REFINE_PERFORMER,
        user,
        bot
      })
      user.setState('deleter')
      break
    } case chosenSubTaskPerformer: {
      const performerValue = response.data.split('*')[2]
      
      let taskData = await getTaskById(user.getSubTask().getLinkId())
      user.getSubTask().setPerformer(performerValue)

      let taskPhrase = genTaskPhrase({
        credentials: taskData,
        state: EST_MENU.CHOSEN_PERFORMER
      })

      let subTaskPhrase = genSubTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: EDIT_SUBTASK_KEYBOARD,
        bot
      })
      user.setState('deleter');
      break
    } case finishEditSubTask: {
      const linkId = user.getSubTask().getLinkId()

      await updateSubTaskById({
        uuid: user.getSubTask().uuid,
        changes: user.getSubTask()
      })

      let taskData = await getTaskById(linkId)
      let subtaskData = await getSubTaskById(user.getSubTask().getLinkId())

      let keyboard = await genAssignedGoalKeyboard({
        data: subtaskData,
        user: taskData,
        sample: SAG_MENU.CHOSEN_STASK,
        createLink: linkId,
        session: user
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

      user.setState('deleter')
      break
    } case cancelEditSubTask: {
      const editSubTaskUuid = user.getSubTask().uuid

      const subTaskData = await getSubTaskByUuid(editSubTaskUuid)
      const taskData = await getTaskById(subTaskData.link_id)

      let taskPhrase = genTaskPhrase({ credentials: taskData, state: SAG_MENU.CHOSEN_STASK })
      let subTaskPhrase = genSubTaskPhrase({ credentials: subTaskData, state: SAG_MENU.CHOSEN_STASK })

      const keyboard = {
        inline_keyboard: [
          [{
            text: 'Ред. субтаску',
            callback_data: `${EST_MENU.EDIT_STASK}*${editSubTaskUuid}`,
          }, {
            text: 'Удл. субтаску',
            callback_data: `${SAG_MENU.DELETE_SUBTASK}*${editSubTaskUuid}`,
          }], [{
            text: 'Уведомить',
            callback_data: `${NOTIFICATION.NOTE_USER_STASK}`
          }],
          [{
            text: 'Назад',
            callback_data: `${SAG_MENU.BACK_CHOOSE_SUBTASK_MENU}*${editSubTaskUuid}`,
          }],
        ],
      }
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard,
        bot
      })
      user.setState('deleter')
      break
    } case backEditSubTask: {
      
      let taskData = await getTaskById(user.getSubTask().getLinkId())
      let taskPhrase = genTaskPhrase({
        credentials: taskData,
        state: EST_MENU.BACK_EST_MENU
      })

      let subTaskPhrase = genSubTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: EDIT_SUBTASK_KEYBOARD,
        bot
      })
      user.setState('deleter');
      break
    }
  }

}
