import { googleSheet } from "../googleSheet/GoogleSheet.js";
import { TABLE_NAMES, TABLE_RANGE } from "../googleSheet/constants/constants.js";
import { telegramBot } from "../telegram/TelegramBot.js";
import {
  BACK_CHECK_APPOINTED_TASKS_MENU_KEYBOARD,
  BACK_CREATE_SUBTASK_MENU_KEYBOARD,
  BACK_CT_MENU_KEYBOARD,
  CHOOSE_BF_SHOW_VERSION_KEYBOARD,
  CHOOSE_BROOT_FORCE_KEYBOARD_1,
  CHOOSE_SUBTASK_PRIORITY_KEYBOARD,
  CREATE_SUBTASK_KEYBOARD,
  CREATE_TASK_KEYBOARD,
  MAIN_KEYBOARD,
} from "../telegram/constants/keyboards.js";
import crypto from "crypto";
import { db } from '../db/DataBase.js'
import { QueryTypes } from "sequelize";
import { SubTask } from "../telegram/SubTask.js";
import { CT_MENU, MAIN_COMMANDS, SAG_MENU } from "../telegram/constants/constants.js";
import { cbqCreateTaskMenu } from "./cbqMenu/cbqCreateTaskMenu.js";
import { cbqKnowTelegramIdMenu } from "./cbqMenu/cbqKnowTelegramIdMenu.js";
import { cbqShowAssignedGoalMenu } from "./cbqMenu/cbqShowAssignedGoal.js";


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

export async function query ({ conditions, tableName }) {
  let taskData

  if (tableName === process.env.DB_TASK_TABLE_NAME) {
    taskData = (await taskConn.query(`
    SELECT
      *
    FROM
      ${tableName}
    WHERE
      link_id = '${conditions}'
    `, { type: QueryTypes.SELECT }))[0]
  } else if (tableName === process.env.DB_SUBTASK_TABLE_NAME) {
    taskData = (await taskConn.query(`
    SELECT
      *
    FROM
      ${tableName}
    WHERE
      link_id = '${conditions}'
    `, { type: QueryTypes.SELECT }))
  }

  return taskData
}

export function genTaskPhrase ({ credentials, state = '' }) {
  let phrase
  if (
    state === 'chosen_task' ||
    state === 'cancel_subtask' ||
    state === 'create_subtask' ||
    state === 'input_subtask_header' ||
    state === 'input_subtask_description' ||
    state === 'chosen_subtask_priotiry' ||
    state === 'back_create_subtask_menu' ||
    state === 'chosen_subtask_performer' ||
    state === 'chosen_subtask_asistant' ||
    state === 'chosen_show_subtask' ||
    state === 'chosen_show_task' ||
    state === 'finish_subtask'
  ) {
    console.log(credentials);
    phrase = `💼 <b>CRM ALGO INC.</b>\n\nОсновная задача\n--------------------------------\nПроект:\n\t\t\t${credentials.project_name}\nЗаголовок:\n\t\t\t${credentials.task_header}\nОписание:\n\t\t\t${credentials.task_desc}\nПриоритет:\n\t\t\t${credentials.task_priority}\nИсполнитель:\n\t\t${credentials.performer_id}\nСоздатель:\n\t\t\t${credentials.senior_id}\nСтатус:\n\t\t${credentials.task_status}\n--------------------------------\n`
    return phrase
  }

  phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${credentials.getLastTask().getProject()}\nЗаголовок:\n\t\t\t${credentials.getLastTask().getHeader()}\nОписание:\n\t\t\t${credentials.getLastTask().getDescription()}\nПриоритет:\n\t\t\t${credentials.getLastTask().getPriority()}\nИсполнитель:\n\t\t${credentials.getLastTask().getPerformer()}\nСоздатель:\n\t\t\t${credentials.getLastTask().getSenior()}\nСтатус:\n\t\t${credentials.getLastTask().getStatus()}\n--------------------------------\n`
  return phrase
}



export function genSubTaskPhrase ({ credentials, state = '' }) {
  let phrase

  phrase = `Создание субтаски:\n--------------------------------\nЗаголовок:\n\t\t\t${credentials.subTask.getHeader()}\nОписание:\n\t\t\t${credentials.subTask.getDescription()}\nПриоритет:\n\t\t\t${credentials.subTask.getPriority()}\nИсполнитель:\n\t\t\t${credentials.subTask.getPerformer()}\nСоздатель:\n\t\t\t${credentials.subTask.getSenior()}\nСтатус:\n\t\t${credentials.subTask.getStatus()}`
  return phrase
}

export async function getBrootForceKeyboard({ data, user, cbData = '', sample = 'chosen_smth', createLink = '' }) {
  const keyboard = {
    inline_keyboard: [
      [{
        text: '<',
        callback_data: 'left_arrow',
      }, {
        text: '🧮',
        callback_data: `${SAG_MENU.CHOSEN_PROJECT}*Бухгалтерия`,
      }, {
        text: '🗄',
        callback_data: `${SAG_MENU.CHOSEN_PROJECT}*Офис`,
      }, {
        text: '🖥',
        callback_data: `${SAG_MENU.CHOSEN_PROJECT}*Парсер`,
      }, {
        text: '🔌',
        callback_data: `${SAG_MENU.CHOSEN_PROJECT}*ТП`,
      }, {
        text: '📊',
        callback_data: `${SAG_MENU.CHOSEN_PROJECT}*Аналитика`,
      }, {
        text: '🗑',
        callback_data: `${SAG_MENU.CHOSEN_PROJECT}*Прокси`,
      }, {
        text: '>',
        callback_data: 'right_arrow',
      }]
    ],
  }

  if (sample === SAG_MENU.CHOSEN_TASK) {
    if (!data) {}
    else {
      data.forEach(async (task) => {
        if (String(task.senior_id) === String(user.getUserId()) && String(task.project_name) === cbData[2]) {
          keyboard.inline_keyboard.push([{
            text: `${task.task_header}`,
            callback_data: `${sample}*${task.link_id}`,
          }])
        }
      })
    }
  } else if (sample === 'chosen_subtask') {
    if (!data) {}
    else {
      console.log('DATA: ', data);
      data.forEach(async (subtask) => {
        if (String(subtask.link_id) === String(user.link_id)) {
          keyboard.inline_keyboard.push([{
            text: `${subtask.subtask_header}`,
            callback_data: `${sample}*${subtask.uuid}`,
          }])
        }
      })
    }

    keyboard.inline_keyboard.push([{
      text: `Ред. таску`,
      callback_data: `edit_task*${createLink}`,
    }, {
      text: `Соз. субтаску`,
      callback_data: `create_subtask*${createLink}`,
    }])
  }

    keyboard.inline_keyboard.push([{
      text: 'Главное меню',
      callback_data: SAG_MENU.BACK_MAIN_MENU
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

export async function showAvailabelTaskPerformer({ response, phrase, user, bot }) {
  let keyboard = {
    inline_keyboard: [],
  };
  const performers = await googleSheet.getDataFromSheet({ tableName: TABLE_NAMES.TABLE_USERS, tableRange: TABLE_RANGE.TABLE_USERS_RANGE })
  performers.forEach(async (performer) => {
    if (String(user.getUserId()) === String(performer.tlgm_id) && String(performer.performer_status) === '1') {
      keyboard.inline_keyboard.push([{
        text: `${performer.assignee_name}`,
        callback_data: `${CT_MENU.CHOSEN_PERFORMER}*${performer.assignee_id}`,
      }])
    }
  })

  keyboard.inline_keyboard.push(BACK_CT_MENU_KEYBOARD.inline_keyboard[0]);

  await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot });
}

async function showAvailabelPerformer({ response, phrase, user, bot }) {
  let keyboard = {
    inline_keyboard: [],
  };
  const performers = await googleSheet.getDataFromSheet({ tableName: TABLE_NAMES.TABLE_USERS, tableRange: TABLE_RANGE.TABLE_USERS_RANGE })
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

export async function showAvailabelProject ({ response, phrase, user, extra = '', bot }) {
  let keyboard = {
    inline_keyboard: [],
  };
  const projectRights = await googleSheet.getDataFromSheet({ tableName: TABLE_NAMES.TABLE_PROJECTS, tableRange: TABLE_RANGE.TABLE_PROJECTS_RANGE })
  projectRights.forEach(async (projectRight) => {
    if (String(user.getUserId()) === String(projectRight.tlgm_id)) {
      keyboard.inline_keyboard.push([{
        text: `${projectRight.project_name}`,
        callback_data: `${CT_MENU.CHOSEN_PROJECT}*${projectRight.project_name}`,
      }])
    }
  })

  keyboard.inline_keyboard.push(BACK_CT_MENU_KEYBOARD.inline_keyboard[0]);

  await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot });
  user.state = 'deleter'
}

export async function processingCallbackQueryOperationLogic({ response, user, bot }) {
  const command = (user.state.split('*'))[0];
  user.mainMsgId = response.message.message_id

  switch (command) {
    case MAIN_COMMANDS.CREATE_TASK : {
      await cbqCreateTaskMenu({ response, user, bot })
      break
    } case MAIN_COMMANDS.KNOW_TG_ID: {
      await cbqKnowTelegramIdMenu({ response, user, bot })
      break
    } case MAIN_COMMANDS.SHOW_AG: {
      await cbqShowAssignedGoalMenu({ response, user, bot })
      break
    }




  //   } case 'choose_subtask_performer': {
  //     user.mainMsgId = response.message.message_id
  //     const phrase = `💼 <b>CRM ALGO INC.</b>\n\nВыберите исполнителя:`
  //     await showAvailabelPerformer({ response, phrase, user, bot })
  //     user.state = 'deleter'
  //     break
  //   } case 'choose_subtask_asistant': {
  //     user.mainMsgId = response.message.message_id
  //     const phrase = `💼 <b>CRM ALGO INC.</b>\n\nВыберите асистента:`
  //     await showAvailabelAsistant({ response, phrase, user, bot })
  //     user.state = 'deleter'
  //     break
  //   } case 'input_subtask_header': {
  //     user.mainMsgId = response.message.message_id
  //     const phrase = `💼 <b>CRM ALGO INC.</b>\n\nУточните заголовок:`
  //     await telegramBot.editMessage({ msg: response, phrase, user, bot })
  //     break
  //   } case 'input_subtask_description': {
  //     user.mainMsgId = response.message.message_id
  //     const phrase = `💼 <b>CRM ALGO INC.</b>\n\nУточните описание:`
  //     await telegramBot.editMessage({ msg: response, phrase, user, bot })
  //     break
  //   } case 'choose_subtask_priority': {
  //     user.mainMsgId = response.message.message_id
  //     const phrase = `💼 <b>CRM ALGO INC.</b>\n\nУкажите приоритет:`
  //     await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CHOOSE_SUBTASK_PRIORITY_KEYBOARD, bot })
  //     user.state = 'deleter'
  //     break
  //   } case 'back_check_appointed_tasks_menu': {
  //     user.mainMsgId = response.message.message_id
  //     const phrase = `💼 <b>CRM ALGO INC.</b>\n\nВыбери проект:`;
  //     await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CHOOSE_BROOT_FORCE_KEYBOARD_MAIN, bot })
  //     user.state = 'deleter';
  //     break
  //   } case 'show_all_projects': {
  //     user.mainMsgId = response.message.message_id
  //     const phrase = `💼 <b>CRM ALGO INC.</b>\n\nВыбери проект:`;
  //     await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CHOOSE_BROOT_FORCE_KEYBOARD_MAIN, bot })
  //     user.state = 'deleter'
  //     break
  //   } 
  //   //--------------------v-------МОИ_ЗАДАЧИ-------v----------------------
  //   case 'show_my_tasks': {
  //     user.mainMsgId = response.message.message_id
  //     const phrase = `💼 <b>CRM ALGO INC.</b>\n\nВыбери проект:`
  //     await telegramBot.editMessage({ msg: response, phrase, user, keyboard: CHOOSE_BF_SHOW_VERSION_KEYBOARD, bot })
  //     user.state = 'deleter'
  //     break
  //   }
  //   //--------------------^-------МОИ_ЗАДАЧИ-------^----------------------
  //   case 'back_create_subtask_menu': {
  //     user.mainMsgId = response.message.message_id
  //     if (!user.subTask) {
  //       await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
  //       return
  //     }

  //     let taskData = await query({
  //       conditions: user.subTask.getLinkId(),
  //       tableName: process.env.DB_TASK_TABLE_NAME
  //     })
      
  //     let taskPhrase = genTaskPhrase({ credentials: taskData, state: 'back_create_subtask_menu' })
  //     let subTaskPhrase = genSubTaskPhrase({ credentials: user })
      
  //     await telegramBot.editMessage({
  //       msg: response,
  //       phrase: taskPhrase + subTaskPhrase,
  //       user,
  //       keyboard: CREATE_SUBTASK_KEYBOARD,
  //       bot
  //     })

  //     user.state = 'deleter'
  //     break
  //   } case 'finish_subtask': {
  //     user.mainMsgId = response.message.message_id

  //     if (!user.subTask) {
  //       await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
  //       return
  //     }

  //     if (
  //       user.subTask.getHeader() === '' ||
  //       user.subTask.getPriority() === '' ||
  //       user.subTask.getSenior() === '' ||
  //       user.subTask.getPerformer() === ''
  //     ) {
  //       const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОдно из полей не заполнено, проверь`
  //       await telegramBot.editMessage({ msg: response, phrase, user, keyboard: BACK_CREATE_SUBTASK_MENU_KEYBOARD, bot })
  //       user.state = 'deleter'
  //       return
  //     }

  //     if (user.subTask.getDescription() === '') user.getLastTask().setDescription('NOT_SPECIFIED')

  //     const log = {
  //       uuid: '',
  //       link_id: '',
  //       created_at: '',
  //       senior_id: '',
  //       senior_nickname: '',
  //       performer_id: '',
  //       performer_nickname: '',
  //       subtask_header: '',
  //       subtask_desc: '',
  //       subtask_priority: '',
  //       subtask_status: '',
  //     }

  //     log.uuid = crypto.randomUUID()
  //     log.link_id = user.subTask.getLinkId()
  //     log.created_at = (new Date()).toISOString()
  //     log.senior_id = user.subTask.getSenior()
  //     log.senior_nickname = 'NOT_SPECIFIED'
  //     log.performer_id = user.subTask.getPerformer()
  //     log.performer_nickname = 'NOT_SPECIFIED'
  //     log.subtask_header = user.subTask.getHeader()
  //     log.subtask_desc = user.subTask.getDescription()
  //     log.subtask_priority = user.subTask.getPriority()
  //     log.subtask_status = 'OPENED'


  //     try {
  //       await subTaskImg.create(log)
  //     } catch (e) {
  //       console.log(`ERROR: ${e.message}`);
  //     }

  //     user.subTask.setHeader('')
  //     user.subTask.setDescription('')
  //     user.subTask.setPriority('')
  //     user.subTask.setSenior('')
  //     user.subTask.setPerformer('')

  //     let taskData = await query({
  //       conditions: user.subTask.getLinkId(),
  //       tableName: process.env.DB_TASK_TABLE_NAME
  //     })

  //     let subtaskData = await query({
  //       conditions: user.subTask.getLinkId(),
  //       tableName: process.env.DB_SUBTASK_TABLE_NAME
  //     })

  //     let taskPhrase = genTaskPhrase({
  //       credentials: taskData,
  //       state: 'finish_subtask'
  //     })

  //     let keyboard = await getBrootForceKeyboard({
  //       data: subtaskData,
  //       user: taskData,
  //       sample: 'chosen_subtask',
  //       createLink: user.subTask.getLinkId()
  //     })
      
  //     await telegramBot.editMessage({
  //       msg: response,
  //       phrase: taskPhrase,
  //       user,
  //       keyboard,
  //       bot
  //     })

  //     user.state = 'deleter'
  //     break
  //   } case 'cancel_subtask': {

  //     user.mainMsgId = response.message.message_id
  //     if (!user.subTask) {
  //       await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
  //       return
  //     }

  //     user.subTask.setHeader('')
  //     user.subTask.setDescription('')
  //     user.subTask.setPriority('')
  //     user.subTask.setPerformer('')
  //     user.subTask.setSenior('')

  //     let taskData = await query({
  //       conditions: user.subTask.getLinkId(),
  //       tableName: process.env.DB_TASK_TABLE_NAME
  //     })

  //     let subtaskData = await query({
  //       conditions: user.subTask.getLinkId(),
  //       tableName: process.env.DB_SUBTASK_TABLE_NAME
  //     })

  //     const phrase = genTaskPhrase({
  //       credentials: taskData,
  //       state: 'cancel_subtask'
  //     })
      
  //     let keyboard = await getBrootForceKeyboard({
  //       data: subtaskData,
  //       user: taskData,
  //       sample: 'chosen_subtask',
  //       createLink: user.subTask.getLinkId()
  //     })
      
  //     await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })
  //     user.state = 'deleter';
  //     break;

  //   } default: {
  //     let cbData = response.data.split('*');
  //     switch (cbData[0]) {
  //        case 'chosen_subtask_priotiry': {
  //         user.mainMsgId = response.message.message_id

  //         if (!user.subTask) {
  //           await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
  //           return
  //         }

  //         let taskData = await query({
  //           conditions: user.subTask.getLinkId(),
  //           tableName: process.env.DB_TASK_TABLE_NAME
  //         })

  //         user.subTask.setPriority(cbData[1])
          
  //         let taskPhrase = genTaskPhrase({ credentials: taskData, state: 'chosen_subtask_priotiry' })
  //         let subTaskPhrase = genSubTaskPhrase({ credentials: user })
          
  //         await telegramBot.editMessage({
  //           msg: response,
  //           phrase: taskPhrase + subTaskPhrase,
  //           user,
  //           keyboard: CREATE_SUBTASK_KEYBOARD,
  //           bot
  //         })

  //         user.state = 'deleter';
  //         break
  //       } case 'chosen_subtask_performer': {
  //         user.mainMsgId = response.message.message_id

  //         if (!user.subTask) {
  //           await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
  //           return
  //         }

  //         let taskData = await query({
  //           conditions: user.subTask.getLinkId(),
  //           tableName: process.env.DB_TASK_TABLE_NAME
  //         })

  //         user.subTask.setPerformer(cbData[1])
         
  //        let taskPhrase = genTaskPhrase({ credentials: taskData, state: 'chosen_subtask_performer' })
  //        let subTaskPhrase = genSubTaskPhrase({ credentials: user })
         
  //         await telegramBot.editMessage({
  //           msg: response,
  //           phrase: taskPhrase + subTaskPhrase,
  //           user,
  //           keyboard: CREATE_SUBTASK_KEYBOARD,
  //           bot
  //         })

  //         user.state = 'deleter';
  //         break
  //       } case 'chosen_subtask_asistant': {
  //         user.mainMsgId = response.message.message_id

  //         if (!user.subTask) {
  //           await telegramBot.editMessage({ msg: response, phrase: 'SERVER WAS RESTARTED', user, keyboard: MAIN_KEYBOARD, bot })
  //           return
  //         }

  //         let taskData = await query({
  //           conditions: user.subTask.getLinkId(),
  //           tableName: process.env.DB_TASK_TABLE_NAME
  //         })

  //         user.subTask.setSenior(cbData[1])
          
  //         let taskPhrase = genTaskPhrase({ credentials: taskData, state: 'chosen_subtask_asistant' })
  //         let subTaskPhrase = genSubTaskPhrase({ credentials: user })
          
  //         await telegramBot.editMessage({
  //           msg: response,
  //           phrase: taskPhrase + subTaskPhrase,
  //           user,
  //           keyboard: CREATE_SUBTASK_KEYBOARD,
  //           bot
  //         })

  //         user.state = 'deleter';
  //         break
  //       } case 'create_subtask': {
  //         user.mainMsgId = response.message.message_id

  //         let taskData = await query({
  //           conditions: cbData[1],
  //           tableName: process.env.DB_TASK_TABLE_NAME
  //         })

  //         user.subTask = new SubTask(cbData[1])

  //         let taskPhrase = genTaskPhrase({ credentials: taskData, state: 'create_subtask' })
  //         let subTaskPhrase = genSubTaskPhrase({ credentials: user })

  //         await telegramBot.editMessage({
  //           msg: response,
  //           phrase: taskPhrase + subTaskPhrase,
  //           user,
  //           keyboard: CREATE_SUBTASK_KEYBOARD,
  //           bot
  //         })

  //         user.state = 'deleter';
  //         break
  //       } case 'chosen_subtask': {
  //         user.mainMsgId = response.message.message_id
          


  //         user.state = 'deleter';
  //         break
  //       } case 'chosen_task': {
  //         user.mainMsgId = response.message.message_id

  //         let taskData = await query({
  //           conditions: cbData[1],
  //           tableName: process.env.DB_TASK_TABLE_NAME
  //         })

  //         let subtaskData = await query({
  //           conditions: taskData.link_id,
  //           tableName: process.env.DB_SUBTASK_TABLE_NAME
  //         })

  //         let keyboard = await getBrootForceKeyboard({
  //           data: subtaskData,
  //           user: taskData,
  //           sample: 'chosen_subtask',
  //           createLink: cbData[1]
  //         })
        
  //         const phrase = genTaskPhrase({ credentials: taskData, state: 'chosen_task' })
  //         await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })

  //         user.state = 'deleter'
  //         break
  //       //--------------------v-------МОИ_ЗАДАЧИ-------v----------------------
  //       case 'show_appointed_project': {
  //         user.mainMsgId = response.message.message_id

  //         let keyboard = {
  //           inline_keyboard: [
  //             [{
  //               text: '<',
  //               callback_data: 'left_arrow',
  //             }, {
  //               text: '🧮',
  //               callback_data: 'show_appointed_project*Бухгалтерия',
  //             }, {
  //               text: '🗄',
  //               callback_data: 'show_appointed_project*Офис',
  //             }, {
  //               text: '🖥',
  //               callback_data: 'show_appointed_project*Парсер',
  //             }, {
  //               text: '🔌',
  //               callback_data: 'show_appointed_project*ТП',
  //             }, {
  //               text: '📊',
  //               callback_data: 'show_appointed_project*Аналитика',
  //             }, {
  //               text: '🗑',
  //               callback_data: 'show_appointed_project*Прокси',
  //             }, {
  //               text: '>',
  //               callback_data: 'right_arrow',
  //             }]
  //           ],
  //         }


  //         let allData = await subTaskConn.query(`
  //         select 
  //           st.subtask_header as subtask_header,
  //           t.task_header as task_header,
  //           t.uuid as task_uuid,
  //           st.uuid as subtask_uuid
  //         from 
  //           task_storage t 
  //         left join
  //           subtasks_storage st
  //         on
  //           t.link_id = st.link_id 
  //         where 
  //           t.project_name = '${cbData[1]}'
  //           and t.performer_id = '${user.getUserId()}'
  //         `, { type: QueryTypes.SELECT })

  //         console.log(allData);
  //         if (!allData.length) {
  //           keyboard.inline_keyboard.push([{
  //             text: `Нет тасок или подзадач`,
  //             callback_data: `NOPE`,
  //           }])
  //         } else {
  //           allData.forEach(record => {
  //             if (!record.subtask_header) {
  //               keyboard.inline_keyboard.push([{
  //                 text: `[Таска] ${record.task_header}`,
  //                 callback_data: `chosen_show_task*${record.task_uuid}`,
  //               }])
  //             } else if (record.subtask_header) {
  //               keyboard.inline_keyboard.push([{
  //                 text: `[Субтаска] ${record.subtask_header}`,
  //                 callback_data: `chosen_show_subtask*${record.subtask_uuid}`,
  //               }])
  //             } 
  //           })
  //         }

  //         keyboard.inline_keyboard.push([{
  //           text: 'Главное меню',
  //           callback_data: 'back_to_main_menu',
  //         }])

  //         const phrase = `Отдел: ${cbData[1]}`

  //         await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot })

  //         user.state = 'deleter'
  //         break
  //       } case 'chosen_show_subtask': {
  //         user.mainMsgId = response.message.message_id

  //         let allData = (await subTaskConn.query(`
  //         select 
  //           t.uuid as task_uuid, 
  //           t.link_id as task_link_id, 
  //           t.created_at as task_created_at, 
  //           t.senior_id as task_senior_id, 
  //           t.senior_nickname as task_senior_nickname, 
  //           t.task_header as task_task_header, 
  //           t.task_desc as task_task_desc, 
  //           t.task_priority as task_task_priority, 
  //           t.task_status as task_task_status, 
  //           t.performer_id as task_performer_id, 
  //           t.performer_nickname as task_performer_nickname, 
  //           t.project_name as task_project_name,
  //           st.uuid as subtask_uuid,
  //           st.link_id as subtask_link_id,
  //           st.created_at as subtask_created_at,
  //           st.senior_id as subtask_senior_id,
  //           st.senior_nickname as subtask_senior_nickname,
  //           st.performer_id as subtask_performer_id,
  //           st.performer_nickname as subtask_performer_nickname,
  //           st.subtask_header as subtask_subtask_header,
  //           st.subtask_desc as subtask_subtask_desc,
  //           st.subtask_priority as subtask_subtask_priority,
  //           st.subtask_status as subtask_subtask_status
  //         from 
  //           task_storage t 
  //         left join
  //           subtasks_storage st
  //         on
  //           t.link_id = st.link_id 
  //         where
  //           st.uuid = '${cbData[1]}'
  //         `, { type: QueryTypes.SELECT }))[0]

          
  //         const phrase = `💼 <b>CRM ALGO INC.</b>\n\nОсновная задача\n--------------------------------\nПроект:\n\t\t\t${allData.task_project_name}\nЗаголовок:\n\t\t\t${allData.task_task_header}\nОписание:\n\t\t\t${allData.task_task_desc}\nПриоритет:\n\t\t\t${allData.task_task_priority}\nИсполнитель:\n\t\t\t${allData.task_performer_id}\nСоздатель:\n\t\t\t${allData.task_senior_id}\nСтатус:\n\t\t${allData.task_task_status}\n--------------------------------\nСубтаска:\n--------------------------------\nЗаголовок:\n\t\t\t${allData.subtask_subtask_header}\nОписание:\n\t\t\t${allData.subtask_subtask_desc}\nПриоритет:\n\t\t\t${allData.subtask_subtask_priority}\nИсполнитель:\n\t\t\t${allData.subtask_performer_id}\nСоздатель:\n\t\t\t${allData.subtask_senior_id}\nСтатус:\n\t\t${allData.subtask_subtask_status}`
          
  //         let keyboard = {
  //           inline_keyboard: [
  //             [{
  //               text: '<',
  //               callback_data: 'left_arrow',
  //             }, {
  //               text: '🧮',
  //               callback_data: 'show_appointed_project*Бухгалтерия',
  //             }, {
  //               text: '🗄',
  //               callback_data: 'show_appointed_project*Офис',
  //             }, {
  //               text: '🖥',
  //               callback_data: 'show_appointed_project*Парсер',
  //             }, {
  //               text: '🔌',
  //               callback_data: 'show_appointed_project*ТП',
  //             }, {
  //               text: '📊',
  //               callback_data: 'show_appointed_project*Аналитика',
  //             }, {
  //               text: '🗑',
  //               callback_data: 'show_appointed_project*Прокси',
  //             }, {
  //               text: '>',
  //               callback_data: 'right_arrow',
  //             }],
  //           ],
  //         }

  //         if (String(allData.subtask_senior_id) === String(user.getUserId())) {
  //           keyboard.inline_keyboard.push(
  //             [{
  //               text: 'Принять',
  //               callback_data: `set_status*ACCEPT*st*${cbData[1]}`
  //             }, {
  //               text: 'Архив',
  //               callback_data: `set_status*ARCHIVE*st*${cbData[1]}`
  //             }, {
  //               text: 'Доработка',
  //               callback_data: `set_status*IMPROVE*st*${cbData[1]}`
  //             }], [{
  //               text: 'Главное меню',
  //               callback_data: 'back_to_main_menu',
  //             }],
  //           )
  //         } else if (
  //             String(allData.subtask_senior_id) !== String(user.getUserId()) && 
  //             String(allData.subtask_performer_id) === String(user.getUserId())
  //           ) {
  //             keyboard.inline_keyboard.push(
  //               [{
  //                 text: 'В работу',
  //                 callback_data: `set_status*IN_PROGRESS*st*${cbData[1]}`
  //               }, {
  //                 text: 'На соглосование',
  //                 callback_data: `set_status*APROVE*st*${cbData[1]}`
  //               }], [{
  //                 text: 'Главное меню',
  //                 callback_data: 'back_to_main_menu',
  //               }],
  //             )
  //           }

  //         await telegramBot.editMessage({
  //           msg: response,
  //           phrase,
  //           user,
  //           keyboard,
  //           bot
  //         })

  //         user.state = 'deleter'
  //         break
  //       } case 'chosen_show_task': {
  //         user.mainMsgId = response.message.message_id

  //         let taskData = (await taskConn.query(`
  //         SELECT
  //           *
  //         FROM
  //           ${process.env.DB_TASK_TABLE_NAME}
  //         WHERE
  //           uuid = '${cbData[1]}'
  //         `, { type: QueryTypes.SELECT }))[0]


  //         const phrase = genTaskPhrase({ credentials: taskData, state: 'chosen_show_task' })

  //         let keyboard = {
  //           inline_keyboard: [
  //             [{
  //               text: '<',
  //               callback_data: 'left_arrow',
  //             }, {
  //               text: '🧮',
  //               callback_data: 'show_appointed_project*Бухгалтерия',
  //             }, {
  //               text: '🗄',
  //               callback_data: 'show_appointed_project*Офис',
  //             }, {
  //               text: '🖥',
  //               callback_data: 'show_appointed_project*Парсер',
  //             }, {
  //               text: '🔌',
  //               callback_data: 'show_appointed_project*ТП',
  //             }, {
  //               text: '📊',
  //               callback_data: 'show_appointed_project*Аналитика',
  //             }, {
  //               text: '🗑',
  //               callback_data: 'show_appointed_project*Прокси',
  //             }, {
  //               text: '>',
  //               callback_data: 'right_arrow',
  //             }]
  //           ],
  //         }

  //         if (String(taskData.senior_id) === String(user.getUserId())) {
  //           keyboard.inline_keyboard.push(
  //             [{
  //               text: 'Принять',
  //               callback_data: `set_status*ACCEPT*t*${cbData[1]}`
  //             }, {
  //               text: 'Архив',
  //               callback_data: `set_status*ARCHIVE*t*${cbData[1]}`
  //             }, {
  //               text: 'Доработка',
  //               callback_data: `set_status*IMPROVE*t*${cbData[1]}`
  //             }], [{
  //               text: 'Главное меню',
  //               callback_data: 'back_to_main_menu',
  //             }],
  //           )
  //         } else if (
  //             String(taskData.senior_id) !== String(user.getUserId()) && 
  //             String(taskData.performer_id) === String(user.getUserId())
  //           ) {
  //             keyboard.inline_keyboard.push(
  //               [{
  //                 text: 'В работу',
  //                 callback_data: `set_status*IN_PROGRESS*t*${cbData[1]}`
  //               }, {
  //                 text: 'На соглосование',
  //                 callback_data: `set_status*APROVE*t*${cbData[1]}`
  //               }], [{
  //                 text: 'Главное меню',
  //                 callback_data: 'back_to_main_menu',
  //               }],
  //             )
  //           }

  //         await telegramBot.editMessage({
  //           msg: response,
  //           phrase,
  //           user,
  //           keyboard,
  //           bot
  //         })

  //         user.state = 'deleter'
  //         break
  //       } case 'set_status': {
  //         user.mainMsgId = response.message.message_id

  //         if (cbData[2] === 't') {
  //           await subTaskConn.query(`
  //             UPDATE
  //               ${process.env.DB_TASK_TABLE_NAME}
  //             SET
  //               task_status = '${cbData[1]}'
  //             WHERE
  //               uuid = '${cbData[3]}'
  //             `, { type: QueryTypes.UPDATE })
  //         } else if (cbData[2] === 'st') {
  //           await subTaskConn.query(`
  //           UPDATE
  //             ${process.env.DB_SUBTASK_TABLE_NAME}
  //           SET
  //             subtask_status = '${cbData[1]}'
  //           WHERE
  //             uuid = '${cbData[3]}'
  //           `, { type: QueryTypes.UPDATE })
  //         }


  //         const phrase = `💼 <b>CRM ALGO INC.</b>\n\nЗадача успешно взята в работу`

  //         let keyboard = {
  //           inline_keyboard: [
  //             [{
  //               text: '<',
  //               callback_data: 'left_arrow',
  //             }, {
  //               text: '🧮',
  //               callback_data: 'show_appointed_project*Бухгалтерия',
  //             }, {
  //               text: '🗄',
  //               callback_data: 'show_appointed_project*Офис',
  //             }, {
  //               text: '🖥',
  //               callback_data: 'show_appointed_project*Парсер',
  //             }, {
  //               text: '🔌',
  //               callback_data: 'show_appointed_project*ТП',
  //             }, {
  //               text: '📊',
  //               callback_data: 'show_appointed_project*Аналитика',
  //             }, {
  //               text: '🗑',
  //               callback_data: 'show_appointed_project*Прокси',
  //             }, {
  //               text: '>',
  //               callback_data: 'right_arrow',
  //             }], [{
  //               text: 'Главное меню',
  //               callback_data: 'back_to_main_menu',
  //             }]
  //           ],
  //         }

  //         await telegramBot.editMessage({
  //           msg: response,
  //           phrase,
  //           user,
  //           keyboard,
  //           bot
  //         })
          
  //         user.state = 'deleter'
  //         break
  //       } 
  //     }
  //   }
  }
}