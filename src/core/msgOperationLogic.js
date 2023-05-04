import { telegramBot } from "../telegram/TelegramBot.js";
import { CREATE_TASK_KEYBOARD, MAIN_KEYBOARD } from "../telegram/constants/keyboards.js";

export async function processingMessageOperationLogic({ response, user, bot }) {
  switch (user.state) {
    case 'input_header': {
      user.getLastTask().setHeader(response.text)
      // const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${user.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${user.getLastTask().getHeader()}\nОписание:\n\t\t\t${user.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${user.getLastTask().getPriority()}\nОтветсвенный:\n\t\t\t${user.getLastTask().getSenior()}\nАсистент:\n\t\t\t${user.getLastTask().getAssistant()}\nИсполнитель:\n\t\t\t${user.getLastTask().getPerformer()}\n--------------------------------\n`
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${user.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${user.getLastTask().getHeader()}\nОписание:\n\t\t\t${user.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${user.getLastTask().getPriority()}\nОтветсвенный:\n\t\t\t${user.getLastTask().getSenior()}\n--------------------------------\n`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.state = 'deleter'
      break
    } case 'input_description': {
      user.getLastTask().setDescription(response.text)
      // const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${user.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${user.getLastTask().getHeader()}\nОписание:\n\t\t\t${user.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${user.getLastTask().getPriority()}\nОтветсвенный:\n\t\t\t${user.getLastTask().getSenior()}\nАсистент:\n\t\t\t${user.getLastTask().getAssistant()}\nИсполнитель:\n\t\t\t${user.getLastTask().getPerformer()}\n--------------------------------\n`
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${user.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${user.getLastTask().getHeader()}\nОписание:\n\t\t\t${user.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${user.getLastTask().getPriority()}\nОтветсвенный:\n\t\t\t${user.getLastTask().getSenior()}\n--------------------------------\n`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      await telegramBot.deleteMsg({ msg: response, user, bot })
      user.state = 'deleter'
      break
    } case 'deleter': {
      await telegramBot.deleteMsg({ msg: response, user, bot })
      break
    } default: {
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.sendMessage({ msg: response, phrase, user, keyboard: MAIN_KEYBOARD, bot })
      user.state = 'deleter'
      break;
    }
  }
}