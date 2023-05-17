import { telegramBot } from "../../telegram/TelegramBot.js";
import { PHRASES, SAG_MENU } from "../../telegram/constants/constants.js";
import { CHOOSE_PROJECT_EMPTY_KEYBOARD, CHOOSE_PROJECT_KEYBOARD_MAIN, MAIN_KEYBOARD } from "../../telegram/constants/keyboards.js";
import { genSubTaskPhrase, genTaskPhrase, getBrootForceKeyboard } from "../cbQueryOperationLogic.js";
import { getCurrentUserTasks, getSubTaskById, getSubTaskByUuid, getTaskById } from "../../db/constants/constants.js";
import { Task } from "../../telegram/Task.js";


export async function cbqShowAssignedGoalMenu({ response, user, bot }) {
  const command = (user.state.split('*'))[1];
  const showAssignedGoal = SAG_MENU.SAG_COMMAND.split('*')[1]
  const chosenProject = SAG_MENU.CHOSEN_PROJECT.split('*')[1]
  const chosenTask = SAG_MENU.CHOSEN_TASK.split('*')[1]
  const chosenSubTask = SAG_MENU.CHOSEN_STASK.split('*')[1]
  const backChooseSubTaskMenu = SAG_MENU.BACK_CHOOSE_SUBTASK_MENU.split('*')[1]
  const backMainMenu = SAG_MENU.BACK_MAIN_MENU.split('*')[1]

  switch(command) {
    case showAssignedGoal: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_PROJECT,
        user,
        keyboard: CHOOSE_PROJECT_KEYBOARD_MAIN,
        bot
      })
      user.state = 'deleter'
      break
    } case chosenProject: {
      const projectValue = response.data.split('*')[2]

      let data = await getCurrentUserTasks({
        projectName: projectValue,
        seniorId: user.getLastTask().getSenior()
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
        user.state = 'deleter'
        return
      }
      const keyboard = await getBrootForceKeyboard({
        data,
        user,
        cbData: user.state.split('*'),
        sample: SAG_MENU.CHOSEN_TASK
      })
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОтдел: ${projectValue}`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })
      user.state = 'deleter'
      break
    } case backMainMenu: {
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: MAIN_KEYBOARD, bot })
      user.state = 'deleter'
      break
    } case chosenTask: {
      const linkId = response.data.split('*')[2]

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



      user.state = 'deleter'
      break
    } case chosenSubTask: {
      const uuid = response.data.split('*')[2]
      
      const subTaskData = await getSubTaskByUuid(uuid)
      const taskData = await getTaskById(subTaskData.link_id)

      let taskPhrase = genTaskPhrase({ credentials: taskData, state: SAG_MENU.CHOSEN_STASK })
      let subTaskPhrase = genSubTaskPhrase({ credentials: subTaskData, state: SAG_MENU.CHOSEN_STASK })

      const keyboard = {
        inline_keyboard: [
          [{
            text: 'Ред. субтаску',
            callback_data: 'empty',
          }, {
            text: 'Удл. субтаску',
            callback_data: 'empty',
          }],
          [{
            text: 'Назад',
            callback_data: `${SAG_MENU.BACK_CHOOSE_SUBTASK_MENU}*${uuid}`,
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
      user.state = 'deleter'
      break
    } case backChooseSubTaskMenu: {

      const uuid = response.data.split('*')[2]

      let staskData = await getSubTaskByUuid(uuid)
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

      user.state = 'deleter'
      break
    }
  }
}
