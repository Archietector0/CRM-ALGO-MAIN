import { telegramBot } from "../../telegram/TelegramBot.js";
import { EST_MENU, MAIN_COMMANDS, PHRASES, SAG_MENU } from "../../telegram/constants/constants.js";
import { CHOOSE_PROJECT_EMPTY_KEYBOARD, CHOOSE_PROJECT_KEYBOARD_MAIN, MAIN_KEYBOARD } from "../../telegram/constants/keyboards.js";
import { genSubTaskPhrase, genTaskPhrase, getBrootForceKeyboard } from "../cbQueryOperationLogic.js";
import { delSubTask, delTask, getCurrentUserTasks, getSubTaskById, getSubTaskByUuid, getTaskById } from "../../db/constants/constants.js";
import { Task } from "../../telegram/Task.js";


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
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_PROJECT,
        user,
        keyboard: CHOOSE_PROJECT_KEYBOARD_MAIN,
        bot
      })
      user.setState('deleter')
      break
    } case deleteTask: {

      const deleteValue = user.getTask().getLinkId()
      const curTask = await getTaskById(deleteValue)
      const projectValue = curTask.project_name
      const senior = curTask.senior_id


      await delTask(deleteValue)

      user.getTask().setProject(projectValue)

      let data = await getCurrentUserTasks({
        projectName: projectValue,
        seniorId: senior
      })

      if (data.length === 0) {
        const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОтдел: ${projectValue}`
        await telegramBot.editMessage({
          msg: response,
          phrase,
          user,
          keyboard: CHOOSE_PROJECT_EMPTY_KEYBOARD,
          bot
        })
        user.setState('deleter')
        return
      }
      const keyboard = await getBrootForceKeyboard({
        data,
        user,
        cbData: user.getState().split('*'),
        sample: SAG_MENU.CHOSEN_TASK,
        project: projectValue
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

      let keyboard = await getBrootForceKeyboard({
        data: subtaskData,
        user: taskData,
        sample: SAG_MENU.CHOSEN_STASK,
        createLink: subtaskData.link_id
      })
    
      const phrase = genTaskPhrase({ credentials: taskData, state: SAG_MENU.CHOSEN_TASK })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })

      
      user.setState('deleter')
      break
    } case chosenProject: {
      const projectValue = response.data.split('*')[2]

      let data = await getCurrentUserTasks({
        projectName: projectValue,
        seniorId: user.getTask().getSenior()
      })

      if (data.length === 0) {
        const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОтдел: ${projectValue}`
        await telegramBot.editMessage({
          msg: response,
          phrase,
          user,
          keyboard: CHOOSE_PROJECT_EMPTY_KEYBOARD,
          bot
        })
        user.setState('deleter')
        return
      }
      const keyboard = await getBrootForceKeyboard({
        data,
        user,
        cbData: user.getState().split('*'),
        sample: SAG_MENU.CHOSEN_TASK
      })
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОтдел: ${projectValue}`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })
      user.setState('deleter')
      break
    } case backMainMenu: {
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: MAIN_KEYBOARD, bot })
      user.setState('deleter')
      break
    } case chosenTask: {

      user.getTask().setLinkId(response.data.split('*')[2])
      const linkId = user.getTask().getLinkId()
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

      let keyboard = await getBrootForceKeyboard({
        data: subtaskData,
        user: taskData,
        sample: SAG_MENU.CHOSEN_STASK,
        createLink: subtaskData.link_id
      })
    
      const phrase = genTaskPhrase({ credentials: taskData, state: SAG_MENU.CHOSEN_TASK })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })

      user.setState('deleter')
      break
    }
  }
}
