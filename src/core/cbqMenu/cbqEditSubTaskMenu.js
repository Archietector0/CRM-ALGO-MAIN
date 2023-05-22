import { getSubTaskById, getSubTaskByUuid, getTaskById, updateSubTaskById } from "../../db/constants/constants.js";
import { SubTask } from "../../telegram/SubTask.js";
import { telegramBot } from "../../telegram/TelegramBot.js";
import { EST_MENU, PHRASES, SAG_MENU } from "../../telegram/constants/constants.js";
import { EDIT_SUBTASK_KEYBOARD, EDIT_SUBTASK_PRIORITY_KEYBOARD, EDIT_SUBTASK_STATUS_KEYBOARD, MAIN_KEYBOARD } from "../../telegram/constants/keyboards.js";
import { genSubTaskPhrase, genTaskPhrase, getBrootForceKeyboard, showAvailabelPerformerEdit, showAvailabelTaskPerformerEdit } from "../cbQueryOperationLogic.js";
import { deepClone } from "../helper.js";

export async function cbqEditSubTaskMenu({ response, user, bot }) {
  const command = (user.state.split('*'))[1];

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

  switch (command) {
    case editSubTask: {
      const editSubTaskUuid = response.data.split('*')[2]
      const subTaskData = await getSubTaskByUuid(editSubTaskUuid)
      const taskData = await getTaskById(subTaskData.link_id)

      const taskPhrase = genTaskPhrase({
        credentials: taskData,
        state: EST_MENU.EDIT_STASK
      })

      let newSubTask = new SubTask(taskData.link_id)
      newSubTask.setHeader(subTaskData.subtask_header)
      newSubTask.setDescription(subTaskData.subtask_desc)
      newSubTask.setPriority(subTaskData.subtask_priority)
      newSubTask.setPerformer(subTaskData.performer_id)
      newSubTask.setSenior(subTaskData.senior_id)
      newSubTask.setStatus(subTaskData.subtask_status)
      newSubTask.uuid = response.data.split('*')[2]

      user.subTask = newSubTask
      // user.subTask.uuid = response.data.split('*')[2]

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

      user.state = 'deleter'
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
      user.state = 'deleter'
      break
    } case chosenSubTaskPriority: {
      // console.log(chosenSubTaskPriority);
      const priorityValue = response.data.split('*')[2]
      user.subTask.setPriority(priorityValue)

      const taskData = await getTaskById(user.subTask.getLinkId())

      const taskPhrase = genTaskPhrase({ credentials: taskData, state: EST_MENU.CHOSEN_PRIORITY })
      const subTaskPhrase = genSubTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: EDIT_SUBTASK_KEYBOARD,
        bot
      })
      user.state = 'deleter'
      break
    } case editSubTaskStatus: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_STATUS,
        user,
        keyboard: EDIT_SUBTASK_STATUS_KEYBOARD,
        bot
      })
      user.state = 'deleter'
      break
    } case chosenSubTaskStatus: {
      const statusValue = response.data.split('*')[2]
      user.subTask.setStatus(statusValue)

      const taskData = await getTaskById(user.subTask.getLinkId())

      const taskPhrase = genTaskPhrase({ credentials: taskData, state: EST_MENU.CHOSEN_STATUS })
      const subTaskPhrase = genSubTaskPhrase({ credentials: user })
      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard: EDIT_SUBTASK_KEYBOARD,
        bot
      })
      user.state = 'deleter'
      break
    } case editSubTaskPerformer: {
      await showAvailabelPerformerEdit({
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
      user.state = 'deleter';
      break
    } case finishEditSubTask: {
      const linkId = user.subTask.getLinkId()

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

      await updateSubTaskById({
        uuid: user.subTask.uuid,
        changes: user.subTask
      })

      let taskData = await getTaskById(linkId)
      let subtaskData = await getSubTaskById(user.subTask.getLinkId())

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

      // user.removeLastTask()
      user.state = 'deleter'
      break
    } case cancelEditSubTask: {
      const editSubTaskUuid = user.subTask.uuid

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
            callback_data: 'empty',
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
      // user.subTask = undefined
      user.state = 'deleter'
      break
    } case backEditSubTask: {
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
      // user.subTask.setPerformer(performerValue)

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
      user.state = 'deleter';
      break
    }
  }

}
