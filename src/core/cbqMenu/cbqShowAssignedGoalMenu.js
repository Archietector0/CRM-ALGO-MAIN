import { telegramBot } from "../../telegram/TelegramBot.js";
import { EST_MENU, GA_MENU, NOTIFICATION, PHRASES, SAG_MENU } from "../../telegram/constants/constants.js";
import { AG_SHORTCUT_BAR, MAIN_KEYBOARD, genMetricsKeyboard } from "../../telegram/constants/keyboards.js";
import { genSubTaskPhrase, genTaskPhrase, genAssignedGoalKeyboard } from "../cbQueryOperationLogic.js";
import { delSubTask, delTask, getAssignedUserGoals, getSubTaskById, getSubTaskByUuid, getTaskById } from "../../db/constants/constants.js";
import { Task } from "../../telegram/Task.js";
import { deepClone } from "../helper.js";


export async function cbqShowAssignedGoalMenu({ response, user, bot }) {
  const command = (user.getState().split('*'))[1];
  const showAssignedGoal = SAG_MENU.SAG_COMMAND.split('*')[1]
  const chosenProject = SAG_MENU.CHOSEN_PROJECT.split('*')[1]
  const chosenTask = SAG_MENU.CHOSEN_TASK.split('*')[1]
  const chosenSubTask = SAG_MENU.CHOSEN_STASK.split('*')[1]
  const deleteTask = SAG_MENU.DELETE_TASK.split('*')[1]
  const deleteSubTask = SAG_MENU.DELETE_SUBTASK.split('*')[1]
  const backChooseSubTaskMenu = SAG_MENU.BACK_CHOOSE_SUBTASK_MENU.split('*')[1]
  const backMainMenu = SAG_MENU.BACK_MAIN_MENU.split('*')[1]

  if (!user.getTask().getLinkId() &&
  command !== showAssignedGoal &&
  command !== chosenProject &&
  command !== backMainMenu &&
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
    case showAssignedGoal: {
      let shortCutBarKeyboard = deepClone(AG_SHORTCUT_BAR)
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
    } case deleteTask: {

      const deleteValue = user.getTask().getLinkId()
      const curTask = await getTaskById(deleteValue)
      const projectValue = curTask.project_name
      const seniorId = curTask.senior_id
      const taskTableName = process.env.DB_TASK_TABLE_NAME
      let data = []


      await delTask(deleteValue)
      user.getTask().setProject(projectValue)
      let assignedTasks = await getAssignedUserGoals({
        tableName: taskTableName,
        roleId: seniorId
      })
      assignedTasks.forEach( async (task) => {
        if (task.project_name === projectValue)
          data.push(task)
      })
      if (data.length === 0) {
        const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОтдел: ${projectValue}`
        let shortCutBarKeyboard = deepClone(AG_SHORTCUT_BAR)
        const metricsKeyboard = await genMetricsKeyboard(user)
  
        shortCutBarKeyboard.inline_keyboard.push(metricsKeyboard.inline_keyboard[0])
        shortCutBarKeyboard.inline_keyboard.push([{
          text: 'Нет тасок в отделе',
          callback_data: 'NOPE_TASKS'
        }])
        shortCutBarKeyboard.inline_keyboard.push(metricsKeyboard.inline_keyboard[1])
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



      const keyboard = await genAssignedGoalKeyboard({
        data,
        user,
        cbData: user.getState().split('*'),
        sample: SAG_MENU.CHOSEN_TASK,
        project: projectValue,
        session: user
      })






      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОтдел: ${projectValue}`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })
      user.setState('deleter')
      break
    } case deleteSubTask: {
      
      const deleteValue = user.subTaskUuid

      
      await delSubTask(deleteValue)


      // const uuid = response.data.split('*')[2]

      // let staskData = await getSubTaskByUuid(deleteValue)

      // console.log(staskData);
      let subtaskData = await getSubTaskById(user.getTask().getLinkId())
      let taskData = await getTaskById(user.getTask().getLinkId())

      let keyboard = await genAssignedGoalKeyboard({
        data: subtaskData,
        user: taskData,
        sample: SAG_MENU.CHOSEN_STASK,
        createLink: subtaskData.link_id,
        session: user
      })
    
      const phrase = genTaskPhrase({ credentials: taskData, state: SAG_MENU.CHOSEN_TASK })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })

      
      user.setState('deleter')
      break
    } case chosenProject: {
      const projectValue = response.data.split('*')[2]
      const seniorId = user.getTask().getSenior()
      const taskTableName = process.env.DB_TASK_TABLE_NAME
      let data = []

      let assignedTasks = await getAssignedUserGoals({
        tableName: taskTableName,
        roleId: seniorId
      })
      assignedTasks.forEach( async (task) => {
        if (task.project_name === projectValue)
          data.push(task)
      })

      if (data.length === 0) {
        const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОтдел: ${projectValue}`
        let shortCutBarKeyboard = deepClone(AG_SHORTCUT_BAR)
        const metricsKeyboard = await genMetricsKeyboard(user)
  
        shortCutBarKeyboard.inline_keyboard.push(metricsKeyboard.inline_keyboard[0])
        shortCutBarKeyboard.inline_keyboard.push([{
          text: 'Нет тасок в отделе',
          callback_data: 'NOPE_TASKS'
        }])
        shortCutBarKeyboard.inline_keyboard.push(metricsKeyboard.inline_keyboard[1])
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
      const keyboard = await genAssignedGoalKeyboard({
        data,
        user,
        cbData: user.getState().split('*'),
        sample: SAG_MENU.CHOSEN_TASK,
        session: user
      })
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОтдел: ${projectValue}`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })
      user.setState('deleter')
      break
    } case backMainMenu: {
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
      break
    } case chosenTask: {

      user.getTask().setLinkId(response.data.split('*')[2])
      const linkId = user.getTask().getLinkId()
      let taskData = await getTaskById(linkId)
      let subtaskData = await getSubTaskById(linkId)
      let keyboard = await genAssignedGoalKeyboard({
        data: subtaskData,
        user: taskData,
        sample: SAG_MENU.CHOSEN_STASK,
        createLink: linkId,
        session: user
      })
      const phrase = genTaskPhrase({ credentials: taskData, state: SAG_MENU.CHOSEN_TASK })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })
      user.setState('deleter')
      break

    } case chosenSubTask: {
      user.subTaskUuid = response.data.split('*')[2]
      
      const subTaskData = await getSubTaskByUuid(user.subTaskUuid)
      const taskData = await getTaskById(subTaskData.link_id)

      let taskPhrase = genTaskPhrase({ credentials: taskData, state: SAG_MENU.CHOSEN_STASK })
      let subTaskPhrase = genSubTaskPhrase({ credentials: subTaskData, state: SAG_MENU.CHOSEN_STASK })

      const keyboard = {
        inline_keyboard: [
          [{
            text: 'Ред. субтаску',
            callback_data: `${EST_MENU.EDIT_STASK}*${user.subTaskUuid}`,
          }, {
            text: 'Удл. субтаску',
            callback_data: `${SAG_MENU.DELETE_SUBTASK}*${user.subTaskUuid}`,
          }], [{
            text: 'Уведомить',
            callback_data: `${NOTIFICATION.NOTE_USER_STASK}`
          }],
          [{
            text: 'Назад',
            callback_data: `${SAG_MENU.BACK_CHOOSE_SUBTASK_MENU}*${user.subTaskUuid}`,
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
    } case backChooseSubTaskMenu: {

      user.subTaskUuid = response.data.split('*')[2]

      let staskData = await getSubTaskByUuid(user.subTaskUuid)
      let subtaskData = await getSubTaskById(staskData.link_id)
      let taskData = await getTaskById(staskData.link_id)

      let keyboard = await genAssignedGoalKeyboard({
        data: subtaskData,
        user: taskData,
        sample: SAG_MENU.CHOSEN_STASK,
        createLink: subtaskData.link_id,
        session: user
      })
    
      const phrase = genTaskPhrase({ credentials: taskData, state: SAG_MENU.CHOSEN_TASK })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })

      user.setState('deleter')
      break
    }
  }
}
