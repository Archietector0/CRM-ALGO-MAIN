import { googleSheet } from "../googleSheet/GoogleSheet.js";
import { TABLE_NAMES, TABLE_RANGE } from "../googleSheet/constants/constants.js";
import { telegramBot } from "../telegram/TelegramBot.js";
import {
  CHOOSE_PRIORITY_KEYBOARD,
  CREATE_TASK_KEYBOARD,
  MAIN_KEYBOARD
} from "../telegram/constants/keyboards.js";

async function showAvailabelAsistant({ response, phrase, user, bot }) {
  let keyboard = {
    inline_keyboard: [],
  };
  const asistants = await googleSheet.getDataFromSheet({ tableName: TABLE_NAMES.TABLE_USERS, tableRange: TABLE_RANGE.TABLE_USERS_RANGE })
  asistants.forEach(async (asistant) => {
    if (String(user.getUserId()) === String(asistant.tlgm_id) && String(asistant.asistant_status) === '1') {
      keyboard.inline_keyboard.push([{
        text: `${asistant.assignee_name}`,
        callback_data: `chosen_asistant*${asistant.assignee_id}`,
      }])
    }
  })

  keyboard.inline_keyboard.push([
    {
      text: 'Назад',
      callback_data: 'back_to_main_menu',
    },
  ]);

  await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot });
}

async function showAvailabelPerformer({ response, phrase, user, bot }) {
  let keyboard = {
    inline_keyboard: [],
  };
  const performers = await googleSheet.getDataFromSheet({ tableName: TABLE_NAMES.TABLE_USERS, tableRange: TABLE_RANGE.TABLE_USERS_RANGE })
  console.log(performers);
  performers.forEach(async (performer) => {
    if (String(user.getUserId()) === String(performer.tlgm_id) && String(performer.performer_status) === '1') {
      keyboard.inline_keyboard.push([{
        text: `${performer.assignee_name}`,
        callback_data: `chosen_performer*${performer.assignee_id}`,
      }])
    }
  })

  keyboard.inline_keyboard.push([
    {
      text: 'Назад',
      callback_data: 'back_to_main_menu',
    },
  ]);

  await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot });
}

async function showAvailabelProject ({ response, phrase, user, bot }) {
  let keyboard = {
    inline_keyboard: [],
  };
  const projectRights = await googleSheet.getDataFromSheet({ tableName: TABLE_NAMES.TABLE_PROJECTS, tableRange: TABLE_RANGE.TABLE_PROJECTS_RANGE })
  projectRights.forEach(async (projectRight) => {
    if (String(user.getUserId()) === String(projectRight.tlgm_id)) {
      keyboard.inline_keyboard.push([{
        text: `${projectRight.project_name}`,
        callback_data: `chosen_project*${projectRight.project_name}`,
      }])
    }
  })

  keyboard.inline_keyboard.push([
    {
      text: 'Назад',
      callback_data: 'back_to_main_menu',
    },
  ]);

  await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot });
}

export async function processingCallbackQueryOperationLogic({ response, user, bot }) {
  switch (user.state) {
    case 'choose_project': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nВыбери к какому отделу привязать задачу:`;
      await showAvailabelProject({ response, phrase, user, bot })
      user.state = 'deleter'
      break
    } case 'choose_performer': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nВыберите исполнителя:`
      await showAvailabelPerformer({ response, phrase, user, bot })
      user.state = 'deleter'
      break
    } case 'choose_asistant': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nВыберите асистента:`
      await showAvailabelAsistant({ response, phrase, user, bot })
      user.state = 'deleter'
      break
    } case 'input_header': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nУточните заголовок:`
      await telegramBot.editMessage({ msg: response, phrase, user, bot })
      break
    } case 'input_description': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nУточните описание:`
      await telegramBot.editMessage({ msg: response, phrase, user, bot })
      break
    } case 'choose_priority': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nУкажите приоритет:`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CHOOSE_PRIORITY_KEYBOARD, bot })
      user.state = 'deleter'
      break
    } case 'create_task': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${user.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${user.getLastTask().getHeader()}\nОписание:\n\t\t\t${user.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${user.getLastTask().getPriority()}\nОтветсвенный:\n\t\t\t${user.getLastTask().getSenior()}\n--------------------------------\n`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      user.state = 'deleter';
      break
    } case 'back_to_main_menu': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: MAIN_KEYBOARD, bot })
      user.state = 'deleter';
      break
    } case 'cancel_task': {
      user.mainMsgId = response.message.message_id

      user.getLastTask().setProject('')
      user.getLastTask().setHeader('')
      user.getLastTask().setDescription('')
      user.getLastTask().setPriority('')
      user.getLastTask().setPerformer('')
      // user.getLastTask().setSenior('')
      user.getLastTask().setAssistant('')

      if (user.getAllTasks().length > 1) user.removeLastTask()

      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: MAIN_KEYBOARD, bot })
      user.state = 'deleter';
      break;
    } default: {
      let cbData = response.data.split('*');
      switch (cbData[0]) {
        case 'chosen_project': {
          user.getLastTask().setProject(cbData[1])
          const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${user.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${user.getLastTask().getHeader()}\nОписание:\n\t\t\t${user.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${user.getLastTask().getPriority()}\nОтветсвенный:\n\t\t\t${user.getLastTask().getSenior()}\n--------------------------------\n`
          await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
          user.state = 'deleter';
          break
        } case 'chosen_priotiry': {
          user.mainMsgId = response.message.message_id
          user.getLastTask().setPriority(cbData[1])
          const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${user.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${user.getLastTask().getHeader()}\nОписание:\n\t\t\t${user.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${user.getLastTask().getPriority()}\nОтветсвенный:\n\t\t\t${user.getLastTask().getSenior()}\n--------------------------------\n`
          await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
          user.state = 'deleter';
          break
        } case 'chosen_performer': {
          user.mainMsgId = response.message.message_id
          user.getLastTask().setPerformer(cbData[1])
          const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${user.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${user.getLastTask().getHeader()}\nОписание:\n\t\t\t${user.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${user.getLastTask().getPriority()}\nОтветсвенный:\n\t\t\t${user.getLastTask().getSenior()}\n--------------------------------\n`
          await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
          user.state = 'deleter';
          break
        } case 'chosen_asistant': {
          user.mainMsgId = response.message.message_id
          user.getLastTask().setAssistant(cbData[1])
          const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${user.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${user.getLastTask().getHeader()}\nОписание:\n\t\t\t${user.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${user.getLastTask().getPriority()}\nОтветсвенный:\n\t\t\t${user.getLastTask().getSenior()}\n--------------------------------\n`
          await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
          user.state = 'deleter';
          break
        }
      }
    }
  }
}