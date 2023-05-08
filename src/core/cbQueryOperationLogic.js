import { googleSheet } from "../googleSheet/GoogleSheet.js";
import { TABLE_NAMES, TABLE_RANGE } from "../googleSheet/constants/constants.js";
import { telegramBot } from "../telegram/TelegramBot.js";
import {
  BACK_CHECK_APPOINTED_TASKS_MENU_KEYBOARD,
  BACK_CREATE_SUBTASK_MENU_KEYBOARD,
  BACK_CREATE_TASK_MENU_KEYBOARD,
  CHOOSE_BROOT_FORCE_KEYBOARD_1,
  CHOOSE_BROOT_FORCE_KEYBOARD_MAIN,
  CHOOSE_PRIORITY_KEYBOARD,
  CHOOSE_SUBTASK_PRIORITY_KEYBOARD,
  CREATE_SUBTASK_KEYBOARD,
  CREATE_TASK_KEYBOARD,
  MAIN_KEYBOARD
} from "../telegram/constants/keyboards.js";
import crypto from "crypto";
import { db } from '../db/DataBase.js'
import { QueryTypes } from "sequelize";
import { SubTask } from "../telegram/SubTask.js";


const taskConn = db.getConnection({
  DB_NAME: process.env.DB_TASK_NAME,
  DB_USERNAME: process.env.DB_TASK_USERNAME,
  DB_PASS: process.env.DB_TASK_PASS,
  DB_DIALECT: process.env.DB_TASK_DIALECT,
  DB_HOST: process.env.DB_TASK_HOST,
  DB_PORT: process.env.DB_TASK_PORT
})
const taskImg = db.getImage({ sequelize: taskConn, modelName: process.env.DB_TASK_TABLE_NAME })


const subTaskConn = db.getConnection({
  DB_NAME: process.env.DB_SUBTASK_NAME,
  DB_USERNAME: process.env.DB_SUBTASK_USERNAME,
  DB_PASS: process.env.DB_SUBTASK_PASS,
  DB_DIALECT: process.env.DB_SUBTASK_DIALECT,
  DB_HOST: process.env.DB_SUBTASK_HOST,
  DB_PORT: process.env.DB_SUBTASK_PORT
})

const subTaskImg = db.getImage({ sequelize: subTaskConn, modelName: process.env.DB_SUBTASK_TABLE_NAME })






async function getBrootForceKeyboard({ data, user, cbData = '', sample = 'chosen_smth', createLink = '' }) {
  const keyboard = {
    inline_keyboard: [
      [{
        text: '<',
        callback_data: 'left_arrow',
      }, {
        text: '🧮',
        callback_data: 'appointed_project*Бухгалтерия',
      }, {
        text: '🗄',
        callback_data: 'appointed_project*Офис',
      }, {
        text: '🖥',
        callback_data: 'appointed_project*Парсер',
      }, {
        text: '🔌',
        callback_data: 'appointed_project*ТП',
      }, {
        text: '📊',
        callback_data: 'appointed_project*Аналитика',
      }, {
        text: '🗑',
        callback_data: 'appointed_project*Прокси',
      }, {
        text: '>',
        callback_data: 'right_arrow',
      }]
    ],
  }

  if (sample === 'chosen_task') {
    data.forEach(async (task) => {
      if (String(task.senior_id) === String(user.getUserId()) && String(task.project_name) === cbData[1]) {
        keyboard.inline_keyboard.push([{
          text: `${task.task_header}`,
          callback_data: `${sample}*${task.uuid}`,
        }])
      }
    })

  } else if (sample === 'chosen_subtask') {
    data.forEach(async (task) => {
      if (String(task.link_id) === String(user.uuid)) {
        keyboard.inline_keyboard.push([{
          text: `${task.subTask_header}`,
          callback_data: `${sample}*${task.uuid}`,
        }])
      }
    })

    keyboard.inline_keyboard.push([{
      text: `Создать субтаску`,
      callback_data: `create_subtask*${createLink}`,
    }])
  }

    keyboard.inline_keyboard.push([{
      text: 'Главное меню',
      callback_data: 'back_to_main_menu'
    }])
  
    return keyboard
}


async function showAvailabelAsistant({ response, phrase, user, bot }) {
  let keyboard = {
    inline_keyboard: [],
  };
  const asistants = await googleSheet.getDataFromSheet({ tableName: TABLE_NAMES.TABLE_USERS, tableRange: TABLE_RANGE.TABLE_USERS_RANGE })
  asistants.forEach(async (asistant) => {
    if (String(user.getUserId()) === String(asistant.tlgm_id) && String(asistant.asistant_status) === '1') {
      keyboard.inline_keyboard.push([{
        text: `${asistant.assignee_name}`,
        callback_data: `chosen_subtask_asistant*${asistant.assignee_id}`,
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
        callback_data: `chosen_subtask_performer*${performer.assignee_id}`,
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

async function showAvailabelProject ({ response, phrase, user, extra = '', bot }) {
  let keyboard = {
    inline_keyboard: [],
  };
  const projectRights = await googleSheet.getDataFromSheet({ tableName: TABLE_NAMES.TABLE_PROJECTS, tableRange: TABLE_RANGE.TABLE_PROJECTS_RANGE })
  projectRights.forEach(async (projectRight) => {
    if (String(user.getUserId()) === String(projectRight.tlgm_id)) {
      keyboard.inline_keyboard.push([{
        text: `${projectRight.project_name}`,
        callback_data: `chosen_project_${extra}*${projectRight.project_name}`,
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
  user.state = 'deleter'
}

export async function processingCallbackQueryOperationLogic({ response, user, bot }) {
  switch (user.state) {
    case 'choose_project': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nВыбери к какому отделу привязать задачу:`;
      await showAvailabelProject({ response, phrase, user, bot })
      user.state = 'deleter'
      break
    } case 'choose_subtask_performer': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nВыберите исполнителя:`
      await showAvailabelPerformer({ response, phrase, user, bot })
      user.state = 'deleter'
      break
    } case 'choose_subtask_asistant': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nВыберите асистента:`
      await showAvailabelAsistant({ response, phrase, user, bot })
      user.state = 'deleter'
      break
    } case 'input_subtask_header': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nУточните заголовок:`
      await telegramBot.editMessage({ msg: response, phrase, user, bot })
      break
    } case 'input_subtask_description': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nУточните описание:`
      await telegramBot.editMessage({ msg: response, phrase, user, bot })
      break
    } case 'choose_subtask_priority': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nУкажите приоритет:`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CHOOSE_SUBTASK_PRIORITY_KEYBOARD, bot })
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
    } case 'back_check_appointed_tasks_menu': {
      user.mainMsgId = response.message.message_id

      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nВыбери проект:`;
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CHOOSE_BROOT_FORCE_KEYBOARD_MAIN, bot })
      
      user.state = 'deleter';
      break
    } case 'back_to_main_menu': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: MAIN_KEYBOARD, bot })
      user.state = 'deleter';
      break
    } case 'show_all_projects': {
      user.mainMsgId = response.message.message_id
     
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nВыбери проект:`;
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CHOOSE_BROOT_FORCE_KEYBOARD_MAIN, bot })
      
      user.state = 'deleter'
      break
    } case 'back_create_subtask_menu': {
      user.mainMsgId = response.message.message_id
      let taskData = (await taskConn.query(`
      SELECT
        *
      FROM
        tasks
      WHERE
        uuid = '${user.subTask.getLinkId()}'
      `, {type: QueryTypes.SELECT }))[0]

      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОсновная задача\n--------------------------------\nПроект:\n\t\t\t${taskData.project_name}\nЗаголовок:\n\t\t\t${taskData.task_header}\nОписание:\n\t\t\t${taskData.task_description}\nПриоритет:\n\t\t\t${taskData.task_priority}\nОтветсвенный:\n\t\t\t${taskData.senior_id}\n--------------------------------\nСоздание субтаски:\n--------------------------------\nЗаголовок:\n\t\t\t${user.subTask.getHeader()}\nОписание:\n\t\t\t${user.subTask.getDescription()}\nПриоритет:\n\t\t\t${user.subTask.getPriority()}\nАсистент:\n\t\t\t${user.subTask.getAssistant()}\nИсполнитель:\n\t\t\t${user.subTask.getPerformer()}\n`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_SUBTASK_KEYBOARD, bot })
      user.state = 'deleter'
      break
    } case 'back_create_task_menu': {
      user.mainMsgId = response.message.message_id
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${user.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${user.getLastTask().getHeader()}\nОписание:\n\t\t\t${user.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${user.getLastTask().getPriority()}\nОтветсвенный:\n\t\t\t${user.getLastTask().getSenior()}\n--------------------------------\n`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_TASK_KEYBOARD, bot })
      user.state = 'deleter'
      break
    } case 'finish_subtask': {
      user.mainMsgId = response.message.message_id

      if (!user.subTask) {
        await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
        return
      }
      

      if (user.subTask.getHeader() === '' ||
          user.subTask.getPriority() === '' ||
          user.subTask.getAssistant() === '' ||
          user.subTask.getPerformer() === '') {
        const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОдно из полей не заполнено, проверь`
        await telegramBot.editMessage({ msg: response, phrase, user, keyboard: BACK_CREATE_SUBTASK_MENU_KEYBOARD, bot })
        user.state = 'deleter'
        return
      }

      if (user.subTask.getDescription() === '') user.getLastTask().setDescription('NOT_SPECIFIED')

      const log = {
        uuid: '',
        link_id: '',
        created_at: '',
        subTask_header: '',
        subTask_description: '',
        subTask_priority: '',
        assistant_id: '',
        performer_id: '',
      }

      log.uuid = crypto.randomUUID()
      log.link_id = user.subTask.getLinkId()
      log.created_at = new Date().toISOString()
      log.subTask_header = user.subTask.getHeader()
      log.subTask_description = user.subTask.getDescription()
      log.subTask_priority = user.subTask.getPriority()
      log.assistant_id = user.subTask.getAssistant()
      log.performer_id = user.subTask.getPerformer()

      try {
        await subTaskImg.create(log)
      } catch (e) {
        console.log(`ERROR: ${e.message}`);
      }

      user.subTask.setHeader('')
      user.subTask.setDescription('')
      user.subTask.setPriority('')
      user.subTask.setAssistant('')
      user.subTask.setPerformer('')

      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CHOOSE_BROOT_FORCE_KEYBOARD_MAIN, bot })

      user.state = 'deleter'
      break
    } case 'finish_task': {
      user.mainMsgId = response.message.message_id

      // Проверка на заполненность дынных
      if (user.getLastTask().getProject() === '' ||
          user.getLastTask().getHeader() === '' ||
          user.getLastTask().getPriority() === '' ||
          user.getLastTask().getSenior() === '') {
        const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОдно из полей не заполнено, проверь`
        await telegramBot.editMessage({ msg: response, phrase, user, keyboard: BACK_CREATE_TASK_MENU_KEYBOARD, bot })
        user.state = 'deleter'
        return
      }

      // Модификация описания
      if (user.getLastTask().getDescription() === '') user.getLastTask().setDescription('NOT_SPECIFIED')

      const log = {
        uuid: '',
        created_at: '',
        project_name: '',
        senior_id: '',
        senior_nickname: '',
        task_header: '',
        task_description: '',
        task_priority: '',
      }

      log.uuid = crypto.randomUUID()
      log.created_at = new Date().toISOString()
      log.project_name = user.getLastTask().getProject()
      log.senior_id = user.getLastTask().getSenior()
      log.senior_nickname = 'NOT_SPECIFIED'
      log.task_header = user.getLastTask().getHeader()
      log.task_description = user.getLastTask().getDescription()
      log.task_priority = user.getLastTask().getPriority()

      try {
        await taskImg.create(log)
      } catch (e) {
        console.log(`ERROR: ${e.message}`);
      }

      user.getLastTask().setProject('')
      user.getLastTask().setHeader('')
      user.getLastTask().setDescription('')
      user.getLastTask().setPriority('')

      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: MAIN_KEYBOARD, bot })

      user.state = 'deleter'
      break
    } case 'cancel_subtask': {
      user.mainMsgId = response.message.message_id
      if (!user.subTask) {
        await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
        return
      }

      user.subTask.setHeader('')
      user.subTask.setDescription('')
      user.subTask.setPriority('')
      user.subTask.setPerformer('')
      user.subTask.setAssistant('')


      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CHOOSE_BROOT_FORCE_KEYBOARD_MAIN, bot })
      user.state = 'deleter';
      break;
    } case 'cancel_task': {
      user.mainMsgId = response.message.message_id

      user.getLastTask().setProject('')
      user.getLastTask().setHeader('')
      user.getLastTask().setDescription('')
      user.getLastTask().setPriority('')

      if (user.getAllTasks().length > 1) user.removeLastTask()

      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: MAIN_KEYBOARD, bot })
      user.state = 'deleter';
      break;
    } default: {
      let cbData = response.data.split('*');
      switch (cbData[0]) {
        case 'chosen_project_': {
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
        } case 'chosen_subtask_priotiry': {
          user.mainMsgId = response.message.message_id
          if (!user.subTask) {
            await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
            return
          }
          let taskData = (await taskConn.query(`
          SELECT
            *
          FROM
            tasks
          WHERE
            uuid = '${user.subTask.getLinkId()}'
          `, {type: QueryTypes.SELECT }))[0]
          user.subTask.setPriority(cbData[1])
          const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОсновная задача\n--------------------------------\nПроект:\n\t\t\t${taskData.project_name}\nЗаголовок:\n\t\t\t${taskData.task_header}\nОписание:\n\t\t\t${taskData.task_description}\nПриоритет:\n\t\t\t${taskData.task_priority}\nОтветсвенный:\n\t\t\t${taskData.senior_id}\n--------------------------------\nСоздание субтаски:\n--------------------------------\nЗаголовок:\n\t\t\t${user.subTask.getHeader()}\nОписание:\n\t\t\t${user.subTask.getDescription()}\nПриоритет:\n\t\t\t${user.subTask.getPriority()}\nАсистент:\n\t\t\t${user.subTask.getAssistant()}\nИсполнитель:\n\t\t\t${user.subTask.getPerformer()}\n`

          // const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${user.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${user.getLastTask().getHeader()}\nОписание:\n\t\t\t${user.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${user.getLastTask().getPriority()}\nОтветсвенный:\n\t\t\t${user.getLastTask().getSenior()}\n--------------------------------\n`
          await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_SUBTASK_KEYBOARD, bot })
          user.state = 'deleter';
          break
        } case 'chosen_subtask_performer': {
          user.mainMsgId = response.message.message_id
          if (!user.subTask) {
            await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
            return
          }
          let taskData = (await taskConn.query(`
          SELECT
            *
          FROM
            tasks
          WHERE
            uuid = '${user.subTask.getLinkId()}'
          `, {type: QueryTypes.SELECT }))[0]
          user.subTask.setPerformer(cbData[1])
          const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОсновная задача\n--------------------------------\nПроект:\n\t\t\t${taskData.project_name}\nЗаголовок:\n\t\t\t${taskData.task_header}\nОписание:\n\t\t\t${taskData.task_description}\nПриоритет:\n\t\t\t${taskData.task_priority}\nОтветсвенный:\n\t\t\t${taskData.senior_id}\n--------------------------------\nСоздание субтаски:\n--------------------------------\nЗаголовок:\n\t\t\t${user.subTask.getHeader()}\nОписание:\n\t\t\t${user.subTask.getDescription()}\nПриоритет:\n\t\t\t${user.subTask.getPriority()}\nАсистент:\n\t\t\t${user.subTask.getAssistant()}\nИсполнитель:\n\t\t\t${user.subTask.getPerformer()}\n`
          await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_SUBTASK_KEYBOARD, bot })
          user.state = 'deleter';
          break
        } case 'chosen_subtask_asistant': {
          user.mainMsgId = response.message.message_id
          if (!user.subTask) {
            await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
            return
          }
          let taskData = (await taskConn.query(`
          SELECT
            *
          FROM
            tasks
          WHERE
            uuid = '${user.subTask.getLinkId()}'
          `, {type: QueryTypes.SELECT }))[0]
          user.subTask.setAssistant(cbData[1])
          const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОсновная задача\n--------------------------------\nПроект:\n\t\t\t${taskData.project_name}\nЗаголовок:\n\t\t\t${taskData.task_header}\nОписание:\n\t\t\t${taskData.task_description}\nПриоритет:\n\t\t\t${taskData.task_priority}\nОтветсвенный:\n\t\t\t${taskData.senior_id}\n--------------------------------\nСоздание субтаски:\n--------------------------------\nЗаголовок:\n\t\t\t${user.subTask.getHeader()}\nОписание:\n\t\t\t${user.subTask.getDescription()}\nПриоритет:\n\t\t\t${user.subTask.getPriority()}\nАсистент:\n\t\t\t${user.subTask.getAssistant()}\nИсполнитель:\n\t\t\t${user.subTask.getPerformer()}\n`
          await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_SUBTASK_KEYBOARD, bot })
          user.state = 'deleter';
          break
        } case 'create_subtask': {
          user.mainMsgId = response.message.message_id

          let taskData = (await taskConn.query(`
          SELECT
            *
          FROM
            tasks
          WHERE
            uuid = '${cbData[1]}'
          `, { type: QueryTypes.SELECT }))[0]

          user.subTask = new SubTask(cbData[1])

          const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОсновная задача\n--------------------------------\nПроект:\n\t\t\t${taskData.project_name}\nЗаголовок:\n\t\t\t${taskData.task_header}\nОписание:\n\t\t\t${taskData.task_description}\nПриоритет:\n\t\t\t${taskData.task_priority}\nОтветсвенный:\n\t\t\t${taskData.senior_id}\n--------------------------------\nСоздание субтаски:\n--------------------------------\nЗаголовок:\n\t\t\t${user.subTask.getHeader()}\nОписание:\n\t\t\t${user.subTask.getDescription()}\nПриоритет:\n\t\t\t${user.subTask.getPriority()}\nАсистент:\n\t\t\t${user.subTask.getAssistant()}\nИсполнитель:\n\t\t\t${user.subTask.getPerformer()}\n`

          await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CREATE_SUBTASK_KEYBOARD, bot })

          user.state = 'deleter';
          break
        } case 'chosen_subtask': {
          user.mainMsgId = response.message.message_id
          


          user.state = 'deleter';
          break
        } case 'chosen_task': {
          user.mainMsgId = response.message.message_id

          let taskData = (await taskConn.query(`
          SELECT
            *
          FROM
            tasks
          WHERE
            uuid = '${cbData[1]}'
          `, { type: QueryTypes.SELECT }))[0]

        
          let subtaskData = await subTaskConn.query(`
          SELECT
            *
          FROM
            "subTasks"
          WHERE
            link_id = '${taskData.uuid}'
          `, { type: QueryTypes.SELECT })

          console.log(subtaskData);
        
          let keyboard = await getBrootForceKeyboard({ data: subtaskData, user: taskData, sample: 'chosen_subtask', createLink: cbData[1] })
        
          const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОсновная задача\n--------------------------------\nПроект:\n\t\t\t${taskData.project_name}\nЗаголовок:\n\t\t\t${taskData.task_header}\nОписание:\n\t\t\t${taskData.task_description}\nПриоритет:\n\t\t\t${taskData.task_priority}\nОтветсвенный:\n\t\t\t${taskData.senior_id}\n--------------------------------\n`
          await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })

          user.state = 'deleter'
          break
        } case 'appointed_project': {
          user.mainMsgId = response.message.message_id
          let data = await taskConn.query(`
            SELECT
              *
            FROM
              tasks
            WHERE
              project_name = '${cbData[1]}'
              and senior_id = '${user.getUserId()}'
          `, { type: QueryTypes.SELECT })

          if (data.length === 0) {
            const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОтдел: ${cbData[1]}`
            const keyboard = {
              inline_keyboard: [
                [{
                  text: '<',
                  callback_data: 'left_arrow',
                }, {
                  text: '🧮',
                  callback_data: 'appointed_project*Бухгалтерия',
                }, {
                  text: '🗄',
                  callback_data: 'appointed_project*Офис',
                }, {
                  text: '🖥',
                  callback_data: 'appointed_project*Парсер',
                }, {
                  text: '🔌',
                  callback_data: 'appointed_project*ТП',
                }, {
                  text: '📊',
                  callback_data: 'appointed_project*Аналитика',
                }, {
                  text: '🗑',
                  callback_data: 'appointed_project*Прокси',
                }, {
                  text: '>',
                  callback_data: 'right_arrow',
                }], [{
                  text: 'Нет тасок в отделе',
                  callback_data: 'NOPE_TASKS'
                }], [{
                  text: 'Главное меню',
                  callback_data: 'back_to_main_menu',
                }],
              ],
            }
            await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })
            user.state = 'deleter'
            return
          }
          const keyboard = await getBrootForceKeyboard({ data, user, cbData, sample: 'chosen_task' })
          const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОтдел: ${cbData[1]}`
          await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })
          user.state = 'deleter'
          break
        }
      }
    }
  }
}