import { googleSheet } from "../googleSheet/GoogleSheet.js";
import { TABLE_NAMES, TABLE_RANGE } from "../googleSheet/constants/constants.js";
import { telegramBot } from "../telegram/TelegramBot.js";
import {
  BACK_CT_MENU_KEYBOARD,
  BACK_EST_MENU_KEYBOARD,
  BACK_ET_MENU_KEYBOARD,
  CG_SHORTCUT_BAR,
  CHOOSE_SUBTASK_PRIORITY_KEYBOARD,
  CREATE_SUBTASK_KEYBOARD,
  CREATE_TASK_KEYBOARD,
  MAIN_KEYBOARD,
} from "../telegram/constants/keyboards.js";
import crypto from "crypto";
import { db } from '../db/DataBase.js'
import { QueryTypes } from "sequelize";
import { SubTask } from "../telegram/SubTask.js";
import { CST_MENU, CT_MENU, EST_MENU, ET_MENU, MAIN_COMMANDS, NOTIFICATION, SAG_MENU, SCG_MENU } from "../telegram/constants/constants.js";
import { cbqCreateTaskMenu } from "./cbqMenu/cbqCreateTaskMenu.js";
import { cbqKnowTelegramIdMenu } from "./cbqMenu/cbqKnowTelegramIdMenu.js";
import { cbqShowAssignedGoalMenu } from "./cbqMenu/cbqShowAssignedGoalMenu.js";
import { cbqCreateSubTaskMenu } from "./cbqMenu/cbqCreateSubTaskMenu.js";
import { cbqEditTaskMenu } from "./cbqMenu/cbqEditTaskMenu.js";
import { cbqEditSubTaskMenu } from "./cbqMenu/cbqEditSubTaskMenu.js";
import { cbqShowCurrentGoalMenu } from "./cbqMenu/cbqShowCurrentGoalMenu.js";
import { deepClone } from "./helper.js";
import { getTaskById } from "../db/constants/constants.js";
import { cbqNoticeUser } from "./cbqMenu/cbqNoticeUser.js";
import { cbqGetUsersActivity } from "./cbqMenu/cbqGetUsersActivity.js";

export function genTaskPhrase ({ credentials, state = '' }) {
  // console.log("state: ", state);
  // console.log("SCG_MENU.CHOSEN_STASK: ", SCG_MENU.CHOSEN_STASK);
  let phrase
  if (
    state === SCG_MENU.CHANGE_TASK ||
    state === SCG_MENU.CHOSEN_TASK ||
    state === SCG_MENU.CHOSEN_STASK ||
    state === EST_MENU.EDIT_STASK ||
    state === EST_MENU.EDIT_HEADER ||
    state === EST_MENU.EDIT_DESC ||
    state === EST_MENU.CHOSEN_PRIORITY ||
    state === EST_MENU.CHOSEN_STATUS ||
    state === EST_MENU.CHOSEN_PERFORMER ||
    state === EST_MENU.BACK_EST_MENU ||
    state === SAG_MENU.CHOSEN_TASK ||
    state === SAG_MENU.CHOSEN_STASK ||
    state === CST_MENU.CANCEL_STASK ||
    state === MAIN_COMMANDS.CREATE_SUBTASK ||
    state === CST_MENU.INPUT_STASK_HEADER ||
    state === CST_MENU.INPUT_STASK_DESC ||
    state === CST_MENU.CHOSEN_STASK_PRIORITY ||
    state === 'back_create_subtask_menu' ||
    state === CST_MENU.CHOSEN_STASK_PERFORMER ||
    state === CST_MENU.CHOSEN_STASK_ASSISTANT ||
    state === 'chosen_show_subtask' ||
    state === 'chosen_show_task' ||
    state === CST_MENU.FINISH_STASK ||
    state === ET_MENU.EDIT_TASK
  ) {
    console.log(credentials);
    phrase = `💼 <b>CRM ALGO INC.</b>\n\nОсновная задача\n--------------------------------\nПроект:\n\t\t\t${credentials.project_name}\nЗаголовок:\n\t\t\t${credentials.task_header}\nОписание:\n\t\t\t${credentials.task_desc}\nПриоритет:\n\t\t\t${credentials.task_priority}\nИсполнитель:\n\t\t${credentials.performer_id}\nСоздатель:\n\t\t\t${credentials.senior_id}\nСтатус:\n\t\t${credentials.task_status}\n--------------------------------\n`
    return phrase
  }

  phrase = `💼 <b>CRM ALGO INC.</b>\n\nСоздание задачи\n--------------------------------\nПроект:\n\t\t\t${credentials.getTask().getProject()}\nЗаголовок:\n\t\t\t${credentials.getTask().getHeader()}\nОписание:\n\t\t\t${credentials.getTask().getDescription()}\nПриоритет:\n\t\t\t${credentials.getTask().getPriority()}\nИсполнитель:\n\t\t\t${credentials.getTask().getPerformer()}\nСоздатель:\n\t\t\t${credentials.getTask().getSenior()}\nСтатус:\n\t\t${credentials.getTask().getStatus()}\n--------------------------------\n`
  return phrase
}

export function genSubTaskPhrase ({ credentials, state = '' }) {
  let phrase

  if (
    state === SAG_MENU.CHOSEN_STASK ||
    state === SCG_MENU.CHOSEN_STASK
    ) {
    phrase = `Субтаска:\n--------------------------------\nЗаголовок:\n\t\t\t${credentials.subtask_header}\nОписание:\n\t\t\t${credentials.subtask_desc}\nПриоритет:\n\t\t\t${credentials.subtask_priority}\nИсполнитель:\n\t\t\t${credentials.performer_id}\nСоздатель:\n\t\t\t${credentials.senior_id}\nСтатус:\n\t\t${credentials.subtask_status}\n--------------------------------\n`
    return phrase
  }

  phrase = `Субтаска:\n--------------------------------\nЗаголовок:\n\t\t\t${credentials.getSubTask().getHeader()}\nОписание:\n\t\t\t${credentials.getSubTask().getDescription()}\nПриоритет:\n\t\t\t${credentials.getSubTask().getPriority()}\nИсполнитель:\n\t\t\t${credentials.getSubTask().getPerformer()}\nСоздатель:\n\t\t\t${credentials.getSubTask().getSenior()}\nСтатус:\n\t\t${credentials.getSubTask().getStatus()}`
  return phrase
}

export async function genCurrentGoalKeyboard({ user, project = '', data, goal }) {
  let keyboard = deepClone(CG_SHORTCUT_BAR)

  if (goal === SCG_MENU.CHOSEN_TASK) {
    if (!data) {}
    else {
      data.forEach(async (task) => {
        if (String(task.project_name) === project) {
          keyboard.inline_keyboard.push([{
            text: `${task.task_header}`,
            callback_data: `${goal}*${task.link_id}`,
          }])
        }
      })
    }

  } else if (goal === SCG_MENU.CHOSEN_STASK) {
    if (!data) {}
    else {
      data.forEach(async (subtask) => {
        if (String(subtask.link_id) === String(user.getTask().getLinkId())) {
          keyboard.inline_keyboard.push([{
            text: `${subtask.subtask_header}`,
            callback_data: `${goal}*${subtask.uuid}`,
          }])
        }
      })
      const currentTask = await getTaskById(user.getTask().getLinkId())
      if (String(currentTask.performer_id) === String(user.getUserId())) {
        keyboard.inline_keyboard.push([{
          text: `Изм. статус`,
          callback_data: `${SCG_MENU.CHANGE_TASK}`,
        }])
      }
    }
  }
  keyboard.inline_keyboard.push([{
    text: 'Главное меню',
    callback_data: `${SAG_MENU.BACK_MAIN_MENU}`
  }])

  return keyboard
}

export async function getBrootForceKeyboard({ data, user, cbData = '', sample = 'chosen_smth', createLink = '', project = '' }) {
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

        if (String(task.senior_id) === String(user.getUserId()) && 
          (String(task.project_name) === cbData[2] ||
          String(task.project_name) === project)) {
          keyboard.inline_keyboard.push([{
            text: `${task.task_header}`,
            callback_data: `${sample}*${task.link_id}`,
          }])
        }
      })
    }
  } else if (sample === SAG_MENU.CHOSEN_STASK) {
    
    if (!data) {}
    else {
      data.forEach(async (subtask) => {
        console.log('subtask.link_id: ', subtask.link_id);
        console.log('user.link_id: ', user.link_id);

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
      callback_data: `${ET_MENU.EDIT_TASK}*${createLink}`,
    }, {
      text: `Удл. таску`,
      callback_data: `${SAG_MENU.DELETE_TASK}*${createLink}`,
    }, {
      text: `Соз. субтаску`,
      callback_data: `${CST_MENU.CST_COMMAND}*${createLink}`,
    }], [{
      text: 'Уведомить',
      callback_data: `${NOTIFICATION.NOTE_USER_TASK}*${createLink}`
    }])
  }

    keyboard.inline_keyboard.push([{
      text: 'Главное меню',
      callback_data: SAG_MENU.BACK_MAIN_MENU
    }])
  
    return keyboard
}

export async function showAvailabelAsistant({ response, phrase, user, bot }) {
  let keyboard = {
    inline_keyboard: [],
  };
  const asistants = await googleSheet.getDataFromSheet({
    tableName: TABLE_NAMES.TABLE_USERS,
    tableRange: TABLE_RANGE.TABLE_USERS_RANGE
  })
  asistants.forEach(async (asistant) => {
    if (String(user.getUserId()) === String(asistant.tlgm_id) && String(asistant.asistant_status) === '1') {
      keyboard.inline_keyboard.push([{
        text: `${asistant.assignee_name}`,
        callback_data: `${CST_MENU.CHOSEN_STASK_ASSISTANT}*${asistant.assignee_id}`,
      }])
    }
  })
  keyboard.inline_keyboard.push([
    {
      text: 'Назад',
      callback_data: CST_MENU.BACK_MAIN_MENU,
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

export async function showAvailabelTaskPerformerEdit({ response, phrase, user, bot }) {
  let keyboard = {
    inline_keyboard: [],
  };
  const performers = await googleSheet.getDataFromSheet({ tableName: TABLE_NAMES.TABLE_USERS, tableRange: TABLE_RANGE.TABLE_USERS_RANGE })
  performers.forEach(async (performer) => {
    if (String(user.getUserId()) === String(performer.tlgm_id) && String(performer.performer_status) === '1') {
      keyboard.inline_keyboard.push([{
        text: `${performer.assignee_name}`,
        callback_data: `${ET_MENU.CHOSEN_PERFORMER}*${performer.assignee_id}`,
      }])
    }
  })

  keyboard.inline_keyboard.push(BACK_ET_MENU_KEYBOARD.inline_keyboard[0]);

  await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot });
}

export async function showAvailabelPerformer({ response, phrase, user, bot }) {
  let keyboard = {
    inline_keyboard: [],
  };

  const performers = await googleSheet.getDataFromSheet({
    tableName: TABLE_NAMES.TABLE_USERS,
    tableRange: TABLE_RANGE.TABLE_USERS_RANGE
  })

  performers.forEach(async (performer) => {
    if (
      String(user.getUserId()) === String(performer.tlgm_id) &&
      String(performer.performer_status) === '1'
    ) {
      keyboard.inline_keyboard.push([{
        text: `${performer.assignee_name}`,
        callback_data: `${CST_MENU.CHOSEN_STASK_PERFORMER}*${performer.assignee_id}`,
      }])
    }
  })

  keyboard.inline_keyboard.push([
    {
      text: 'Назад',
      callback_data: CST_MENU.BACK_MAIN_MENU,
    },
  ]);

  await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot });
}

export async function showAvailabelPerformerEdit({ response, phrase, user, bot }) {
  let keyboard = {
    inline_keyboard: [],
  };

  const performers = await googleSheet.getDataFromSheet({
    tableName: TABLE_NAMES.TABLE_USERS,
    tableRange: TABLE_RANGE.TABLE_USERS_RANGE
  })

  performers.forEach(async (performer) => {
    if (
      String(user.getUserId()) === String(performer.tlgm_id) &&
      String(performer.performer_status) === '1'
    ) {
      keyboard.inline_keyboard.push([{
        text: `${performer.assignee_name}`,
        callback_data: `${EST_MENU.CHOSEN_PERFORMER}*${performer.assignee_id}`,
      }])
    }
  })

  keyboard.inline_keyboard.push([
    {
      text: 'Назад',
      callback_data: EST_MENU.BACK_EST_MENU,
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
  const command = (user.getState().split('*'))[0];
  user.setMainMsgId(response.message.message_id)

  switch (command) {
    case MAIN_COMMANDS.CREATE_TASK: {
      await cbqCreateTaskMenu({ response, user, bot })
      break
    } case MAIN_COMMANDS.CREATE_SUBTASK: {
      await cbqCreateSubTaskMenu({ response, user, bot })
      break
    } case MAIN_COMMANDS.KNOW_TG_ID: {
      await cbqKnowTelegramIdMenu({ response, user, bot })
      break
    } case MAIN_COMMANDS.SHOW_AG: {
      await cbqShowAssignedGoalMenu({ response, user, bot })
      break
    } case MAIN_COMMANDS.EDIT_TASK: {
      await cbqEditTaskMenu({ response, user, bot })
      break
    } case MAIN_COMMANDS.EDIT_STASK: {
      await cbqEditSubTaskMenu({ response, user, bot })
      break
    } case MAIN_COMMANDS.SHOW_CG: {
      await cbqShowCurrentGoalMenu({ response, user, bot })
      break
    } case MAIN_COMMANDS.NOTICE: {
      await cbqNoticeUser({ response, user, bot })
      break
    } case MAIN_COMMANDS.GET_ACTIVITY: {
      await cbqGetUsersActivity({ response, user, bot })
      break
    }



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

  //   } default: {
  //     let cbData = response.data.split('*');
  //     switch (cbData[0]) {
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