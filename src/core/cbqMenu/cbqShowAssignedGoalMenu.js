import { telegramBot } from "../../telegram/TelegramBot.js";
import { PHRASES, SAG_MENU } from "../../telegram/constants/constants.js";
import { CHOOSE_PROJECT_EMPTY_KEYBOARD, CHOOSE_PROJECT_KEYBOARD_MAIN, MAIN_KEYBOARD } from "../../telegram/constants/keyboards.js";
import { genTaskPhrase, getBrootForceKeyboard } from "../cbQueryOperationLogic.js";
import { getCurrentUserTasks, getSubTaskById, getTaskById } from "../../db/constants/constants.js";
import { Task } from "../../telegram/Task.js";


export async function cbqShowAssignedGoalMenu({ response, user, bot }) {
  const command = (user.state.split('*'))[1];
  const showAssignedGoal = SAG_MENU.SAG_COMMAND.split('*')[1]
  const chosenProject = SAG_MENU.CHOSEN_PROJECT.split('*')[1]
  const chosenTask = SAG_MENU.CHOSEN_TASK.split('*')[1]
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
    
      const phrase = genTaskPhrase({ credentials: taskData, state: 'chosen_task' })
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })

      let newTask = new Task(taskData.senior_id)
      newTask.setProject(taskData.project_name)
      newTask.setHeader(taskData.task_header)
      newTask.setDescription(taskData.task_desc)
      newTask.setPriority(taskData.task_priority)
      newTask.setPerformer(taskData.performer_id)
      newTask.setSenior(taskData.senior_id)
      newTask.setStatus(taskData.task_status)
      newTask.setLinkId(linkId)


      user.addTask(newTask)


      user.state = 'deleter'
      break
    }
  }
}
