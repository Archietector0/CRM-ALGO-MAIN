import { getCurrentUserGoals, getPerformanceSubTasks, getSubTaskById, getSubTaskByUuid, getTaskById, updateSubTaskById, updateTaskById } from "../../db/constants/constants.js";
import { SubTask } from "../../telegram/SubTask.js";
import { Task } from "../../telegram/Task.js";
import { telegramBot } from "../../telegram/TelegramBot.js";
import { PHRASES, SAG_MENU, SCG_MENU } from "../../telegram/constants/constants.js";
import { CG_SHORTCUT_BAR, CHANGE_SUBTASK_STATUS_KEYBOARD, CHANGE_TASK_STATUS_KEYBOARD, MAIN_KEYBOARD, genMetricsKeyboard } from "../../telegram/constants/keyboards.js";
import { genCurrentGoalKeyboard, genSubTaskPhrase, genTaskPhrase } from "../cbQueryOperationLogic.js";
import { deepClone } from "../helper.js";

export async function cbqShowCurrentGoalMenu({ response, user, bot }) {
  const command = (user.getState().split('*'))[1];
  const showCurrentGoal = SCG_MENU.SCG_COMMAND.split('*')[1]
  const chosenProject = SCG_MENU.CHOSEN_PROJECT.split('*')[1]

  const chosenTask = SCG_MENU.CHOSEN_TASK.split('*')[1]
  const chosenSubTask = SCG_MENU.CHOSEN_STASK.split('*')[1]

  const changeTask = SCG_MENU.CHANGE_TASK.split('*')[1]
  const changeSubTask = SCG_MENU.CHANGE_STASK.split('*')[1]

  const chosenTaskStatus = SCG_MENU.CHOSEN_TASK_STATUS.split('*')[1]
  const chosenSubTaskStatus = SCG_MENU.CHOSEN_STASK_STATUS.split('*')[1]


  const backChooseSubtaskMenu = SCG_MENU.BACK_CHOOSE_SUBTASK_MENU.split('*')[1]

  if (!user.getTask().getLinkId() &&
  command !== showCurrentGoal &&
  command !== chosenProject &&
  command !== chosenTask) {
    await telegramBot.editMessage({
      msg: response,
      phrase: 'SERVER WAS RESTARTED',
      user,
      keyboard: MAIN_KEYBOARD,
      bot
    })
    return
  }

  switch(command) {
    case showCurrentGoal: {
      let shortCutBarKeyboard = deepClone(CG_SHORTCUT_BAR)
      const metricsKeyboard = await genMetricsKeyboard(user)

      shortCutBarKeyboard.inline_keyboard.push(metricsKeyboard.inline_keyboard[0])
      shortCutBarKeyboard.inline_keyboard.push(metricsKeyboard.inline_keyboard[1])

      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_PROJECT,
        user,
        keyboard: shortCutBarKeyboard, 
        bot
      })

      user.setState('deleter')
      break
    } case chosenProject: {
      const projectValue = response.data.split('*')[2]
      const performerId = user.getUserId()
      const taskTableName = process.env.DB_TASK_TABLE_NAME
      const subTaskTableName = process.env.DB_SUBTASK_TABLE_NAME
      let availableTasks = []
      let subTasksLinkId = new Set()
      let goalProjectNames = new Set()

      const performanceSubTasks = await getCurrentUserGoals({
        tableName: subTaskTableName,
        roleId: performerId
      })

      const performanceTasks = await getCurrentUserGoals({
        tableName: taskTableName,
        roleId: performerId
      })

      performanceSubTasks.forEach( subTask => {
        subTasksLinkId.add(subTask.link_id)
      })
      performanceTasks.forEach( task => {
        subTasksLinkId.add(task.link_id)
      })

      for (let linkId of subTasksLinkId)
        availableTasks.push(await getTaskById(linkId))
      
      availableTasks.forEach( availableTask => {
        goalProjectNames.add(availableTask.project_name)
      })

      if (!goalProjectNames.has(projectValue)) {
        let shortCutBarKeyboard = deepClone(CG_SHORTCUT_BAR)
        const metricsKeyboard = await genMetricsKeyboard(user)

        shortCutBarKeyboard.inline_keyboard.push(metricsKeyboard.inline_keyboard[0])
        shortCutBarKeyboard.inline_keyboard.push([{
          text: 'Нет тасок в отделе',
          callback_data: 'NOPE_TASKS'
        }])
        shortCutBarKeyboard.inline_keyboard.push(metricsKeyboard.inline_keyboard[1])

        const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОтдел: ${projectValue}`
        await telegramBot.editMessage({
          msg: response,
          phrase,
          user,
          keyboard: shortCutBarKeyboard,
          bot
        })
        user.setState('deleter')
        return
      }

      const keyboard = await genCurrentGoalKeyboard({
        user,
        project: projectValue,
        data: availableTasks,
        goal: SCG_MENU.CHOSEN_TASK
      })

      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОтдел: ${projectValue}`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })

      user.setState('deleter')
      break
    } case chosenTask: {
      user.getTask().setLinkId(response.data.split('*')[2])

      if (!user.getTask().getLinkId()) {
        await telegramBot.editMessage({
          msg: response,
          phrase: 'SERVER WAS RESTARTED',
          user,
          keyboard: MAIN_KEYBOARD,
          bot
        })
        return
      }

      const linkId = user.getTask().getLinkId()
      const performerId = user.getUserId()


      let performanceTask = await getTaskById(linkId)

      let performanceSubTasks = await getPerformanceSubTasks({
        linkId: linkId,
        performerId: performerId
      })

      let keyboard = await genCurrentGoalKeyboard({
        user,
        data: performanceSubTasks,
        goal: SCG_MENU.CHOSEN_STASK
      })

      const phrase = genTaskPhrase({
        credentials: performanceTask,
        state: SCG_MENU.CHOSEN_TASK
      })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })
      user.setState('deleter')
      break
    } case chosenSubTask: {
      user.subTaskUuid = response.data.split('*')[2]
      const performanceSubTask = await getSubTaskByUuid(user.subTaskUuid)
      const performanceTask = await getTaskById(performanceSubTask.link_id)
      

      let taskPhrase = genTaskPhrase({
        credentials: performanceTask,
        state: SCG_MENU.CHOSEN_TASK
      })

      let subTaskPhrase = genSubTaskPhrase({
        credentials: performanceSubTask,
        state: SCG_MENU.CHOSEN_STASK
      })

      const keyboard = {
        inline_keyboard: [
          [{
            text: 'Изм. статус',
            callback_data: `${SCG_MENU.CHANGE_STASK}`,
          }, {
            text: 'Назад',
            callback_data: `${SCG_MENU.BACK_CHOOSE_SUBTASK_MENU}`,
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
    } case backChooseSubtaskMenu: {
      let staskData = await getSubTaskByUuid(user.subTaskUuid)
      let subtaskData = await getSubTaskById(staskData.link_id)
      let taskData = await getTaskById(staskData.link_id)
      

      let keyboard = await genCurrentGoalKeyboard({
        user,
        data: subtaskData,
        goal: SCG_MENU.CHOSEN_STASK
      })

      const phrase = genTaskPhrase({ credentials: taskData, state: SAG_MENU.CHOSEN_TASK })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })

      user.setState('deleter')
      break
    } case changeTask: {
      const editTaskLinkId = user.getTask().getLinkId()
      const currentTask = await getTaskById(editTaskLinkId)
      const phrase = genTaskPhrase({
        credentials: currentTask,
        state: SCG_MENU.CHANGE_TASK
      })

      let newTask = new Task(currentTask.senior_id)
      newTask.setProject(currentTask.project_name)
      newTask.setHeader(currentTask.task_header)
      newTask.setDescription(currentTask.task_desc)
      newTask.setPriority(currentTask.task_priority)
      newTask.setPerformer(currentTask.performer_id)
      newTask.setSenior(currentTask.senior_id)
      newTask.setStatus(currentTask.task_status)
      newTask.setLinkId(editTaskLinkId)

      user.setTask(newTask)

      await telegramBot.editMessage({
        msg: response,
        phrase,
        user,
        keyboard: CHANGE_TASK_STATUS_KEYBOARD,
        bot
      })
      
      user.setState('deleter')
      break
    } case chosenTaskStatus: {
      const statusValue = response.data.split('*')[2]
      user.getTask().setStatus(statusValue)
      const linkId = user.getTask().getLinkId()
      await updateTaskById({
        linkId: linkId,
        changes: user.getTask()
      })
      const performerId = user.getUserId()
      let performanceTask = await getTaskById(linkId)

      let performanceSubTasks = await getPerformanceSubTasks({
        linkId: linkId,
        performerId: performerId
      })

      let keyboard = await genCurrentGoalKeyboard({
        user,
        data: performanceSubTasks,
        goal: SCG_MENU.CHOSEN_STASK
      })
      const phrase = genTaskPhrase({
        credentials: performanceTask,
        state: SCG_MENU.CHOSEN_TASK
      })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })
      
      
      user.setState('deleter')
      break
    } case changeSubTask: {
      const editSubTaskUuid = user.subTaskUuid
      const subTaskData = await getSubTaskByUuid(editSubTaskUuid)
      const taskData = await getTaskById(subTaskData.link_id)

      let newSubTask = new SubTask()
      newSubTask.setLinkId(taskData.link_id)
      newSubTask.setHeader(subTaskData.subtask_header)
      newSubTask.setDescription(subTaskData.subtask_desc)
      newSubTask.setPriority(subTaskData.subtask_priority)
      newSubTask.setPerformer(subTaskData.performer_id)
      newSubTask.setSenior(subTaskData.senior_id)
      newSubTask.setStatus(subTaskData.subtask_status)
      newSubTask.uuid = editSubTaskUuid

      user.setSubTask(newSubTask)

      const subTaskPhrase = genSubTaskPhrase({ credentials: user })

      await telegramBot.editMessage({
        msg: response,
        phrase: subTaskPhrase,
        user,
        keyboard: CHANGE_SUBTASK_STATUS_KEYBOARD,
        bot
      })

      user.setState('deleter')
      break
    } case chosenSubTaskStatus: {
      const statusValue = response.data.split('*')[2]
      user.getSubTask().setStatus(statusValue)
      const uuid = user.subTaskUuid
      await updateSubTaskById({
        uuid,
        changes: user.getSubTask()
      })

      let performanceTask = await getTaskById(user.getTask().getLinkId())
      let keyboard = {
        inline_keyboard: [
          [{
            text: 'Изм. статус',
            callback_data: `${SCG_MENU.CHANGE_STASK}`,
          }, {
            text: 'Назад',
            callback_data: `${SCG_MENU.BACK_CHOOSE_SUBTASK_MENU}`,
          }]
        ],
      }

      const taskPhrase = genTaskPhrase({
        credentials: performanceTask,
        state: SCG_MENU.CHOSEN_TASK
      })

      const subTaskPhrase = genSubTaskPhrase({
        credentials: user,
        // state: SCG_MENU.CHOSEN_STASK
      })

      await telegramBot.editMessage({
        msg: response,
        phrase: taskPhrase + subTaskPhrase,
        user,
        keyboard,
        bot
      })
      
      user.setState('deleter')
      break
    }
  }







}
