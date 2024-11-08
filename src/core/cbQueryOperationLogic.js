import { googleSheet } from "../googleSheet/GoogleSheet.js";
import { TABLE_NAMES, TABLE_RANGE } from "../googleSheet/constants/constants.js";
import { telegramBot } from "../telegram/TelegramBot.js";
import {
  AG_SHORTCUT_BAR,
  BACK_CST_MENU_KEYBOARD,
  BACK_CT_MENU_KEYBOARD,
  BACK_EST_MENU_KEYBOARD,
  BACK_ET_MENU_KEYBOARD,
  CG_SHORTCUT_BAR,
  CHOOSE_SUBTASK_PRIORITY_KEYBOARD,
  CREATE_SUBTASK_KEYBOARD,
  CREATE_TASK_KEYBOARD,
  MAIN_KEYBOARD,
  genMetricsKeyboard,
} from "../telegram/constants/keyboards.js";
import crypto from "crypto";
import { db } from '../db/DataBase.js'
import { QueryTypes } from "sequelize";
import { SubTask } from "../telegram/SubTask.js";
import { CST_MENU, CT_MENU, DEPARTURES, EST_MENU, ET_MENU, MAIN_COMMANDS, NOTIFICATION, PHRASES, SAG_MENU, SCG_MENU } from "../telegram/constants/constants.js";
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
// import { cbqAdminPanelMenu } from "./cbqMenu/cbqAdminPanelMenu.js";

export function genTaskPhrase ({ credentials, state = '' }) {
  console.log('TYPE: ', credentials);

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
    state === CST_MENU.CHOSEN_STASK_PERFORMER ||
    state === CST_MENU.BACK_MAIN_MENU ||
    state === CT_MENU.CHOSEN_ASSISTANT ||
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
  const metricsKeyboard = await genMetricsKeyboard(user)

  keyboard.inline_keyboard.push(metricsKeyboard.inline_keyboard[0])

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
          text: 'Уведомить',
          callback_data: `${NOTIFICATION.NOTE_USER_CUR_TASK}`
        }, {
          text: `Изм. статус`,
          callback_data: `${SCG_MENU.CHANGE_TASK}`,
        }])
      }
    }
  }

  keyboard.inline_keyboard.push(metricsKeyboard.inline_keyboard[1])
  
  return keyboard
}

// data, user, cbData = '', sample = 'chosen_smth', createLink = '', project = ''
export async function genAssignedGoalKeyboard({ data, user, cbData = '', sample = 'chosen_smth', createLink = '', project = '', session }) {
  const keyboard = deepClone(AG_SHORTCUT_BAR)
  const metricsKeyboard = await genMetricsKeyboard(session)

  keyboard.inline_keyboard.push(metricsKeyboard.inline_keyboard[0])

  if (sample === SAG_MENU.CHOSEN_TASK) {
    if (!data) {}
    else {
      data.forEach(async (task) => {

        if ((String(task.project_name) === cbData[2] ||
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

  keyboard.inline_keyboard.push(metricsKeyboard.inline_keyboard[1])

  return keyboard
}

// export async function genAssignedGoalKeyboard({ data, user, cbData = '', sample = 'chosen_smth', createLink = '', project = '' }) {
//   const keyboard = deepClone(AG_SHORTCUT_BAR)
//   const metricsKeyboard = await genMetricsKeyboard(user)

//   keyboard.inline_keyboard.push(metricsKeyboard.inline_keyboard[0])

//   if (sample === SAG_MENU.CHOSEN_TASK) {
//     if (!data) {}
//     else {
//       data.forEach(async (task) => {

//         if (String(task.senior_id) === String(user.getUserId()) && 
//           (String(task.project_name) === cbData[2] ||
//           String(task.project_name) === project)) {
//           keyboard.inline_keyboard.push([{
//             text: `${task.task_header}`,
//             callback_data: `${sample}*${task.link_id}`,
//           }])
//         }
//       })
//     }
//   } else if (sample === SAG_MENU.CHOSEN_STASK) {
//     if (!data) {}
//     else {
//       data.forEach(async (subtask) => {
//         if (String(subtask.link_id) === String(user.link_id)) {
//           keyboard.inline_keyboard.push([{
//             text: `${subtask.subtask_header}`,
//             callback_data: `${sample}*${subtask.uuid}`,
//           }])
//         }
//       })
//     }

//     keyboard.inline_keyboard.push([{
//       text: `Ред. таску`,
//       callback_data: `${ET_MENU.EDIT_TASK}*${createLink}`,
//     }, {
//       text: `Удл. таску`,
//       callback_data: `${SAG_MENU.DELETE_TASK}*${createLink}`,
//     }, {
//       text: `Соз. субтаску`,
//       callback_data: `${CST_MENU.CST_COMMAND}*${createLink}`,
//     }], [{
//       text: 'Уведомить',
//       callback_data: `${NOTIFICATION.NOTE_USER_TASK}*${createLink}`
//     }])
//   }

//   keyboard.inline_keyboard.push(metricsKeyboard.inline_keyboard[1])

//   return keyboard
// }

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

// TODO: When owner will create list, modify this func
export async function showAvailabelTaskPerformer({ response, phrase, user, bot }) {
  if (!user.getTask().getProject()) {
    await telegramBot.editMessage({
      msg: response,
      phrase: PHRASES.REFINE_PROJECT,
      user,
      keyboard: BACK_CT_MENU_KEYBOARD,
      bot
    })
    user.setState('deleter')
    return
  }

  let flag = false

  let keyboard = {
    inline_keyboard: [],
  };
  const usersRights = await googleSheet.getDataFromSheet({
    tableName: TABLE_NAMES.TABLE_USERS,
    tableRange: TABLE_RANGE.TABLE_USERS_RANGE
  })
  const projectRights = await googleSheet.getDataFromSheet({
    tableName: TABLE_NAMES.TABLE_PROJECTS,
    tableRange: TABLE_RANGE.TABLE_PROJECTS_RANGE
  })

  for (let i = 0; i < projectRights.length; i++) {
    if (
      String(projectRights[i].project_name) === String(user.getTask().getProject()) &&
      String(projectRights[i].tlgm_id) === String(user.getUserId())
    ) {
      flag = true
      break
    }
  }

  usersRights.forEach(async (userRight) => {
    if (
      String(userRight.tlgm_id) === String(user.getUserId()) &&
      userRight.project_name === user.getTask().getProject() &&
      flag
      ) {
      keyboard.inline_keyboard.push([{
        text: `${userRight.assignee_name}`,
        callback_data: `${CT_MENU.CHOSEN_PERFORMER}*${userRight.assignee_id}`,
      }])
    }
  })

  keyboard.inline_keyboard.push(BACK_CT_MENU_KEYBOARD.inline_keyboard[0]);

  await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot });
}

export async function showAvailabelTaskPerformerEdit({ response, phrase, user, bot }) {
  if (!user.getTask().getProject()) {
    await telegramBot.editMessage({
      msg: response,
      phrase: PHRASES.REFINE_PROJECT,
      user,
      keyboard: BACK_CT_MENU_KEYBOARD,
      bot
    })
    user.setState('deleter')
    return
  }

  let flag = false

  let keyboard = {
    inline_keyboard: [],
  };
  const usersRights = await googleSheet.getDataFromSheet({
    tableName: TABLE_NAMES.TABLE_USERS,
    tableRange: TABLE_RANGE.TABLE_USERS_RANGE
  })
  const projectRights = await googleSheet.getDataFromSheet({
    tableName: TABLE_NAMES.TABLE_PROJECTS,
    tableRange: TABLE_RANGE.TABLE_PROJECTS_RANGE
  })

  for (let i = 0; i < projectRights.length; i++) {
    if (
      String(projectRights[i].project_name) === String(user.getTask().getProject()) &&
      String(projectRights[i].tlgm_id) === String(user.getUserId())
    ) {
      flag = true
      break
    }
  }

  usersRights.forEach(async (userRight) => {
    if (
      String(userRight.tlgm_id) === String(user.getUserId()) &&
      userRight.project_name === user.getTask().getProject() &&
      flag
      ) {
      keyboard.inline_keyboard.push([{
        text: `${userRight.assignee_name}`,
        callback_data: `${ET_MENU.CHOSEN_PERFORMER}*${userRight.assignee_id}`,
      }])
    }
  })

  keyboard.inline_keyboard.push(BACK_ET_MENU_KEYBOARD.inline_keyboard[0]);

  await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot });
  // let keyboard = {
  //   inline_keyboard: [],
  // };
  // const performers = await googleSheet.getDataFromSheet({ tableName: TABLE_NAMES.TABLE_USERS, tableRange: TABLE_RANGE.TABLE_USERS_RANGE })
  // performers.forEach(async (performer) => {
  //   if (String(user.getUserId()) === String(performer.tlgm_id) && String(performer.performer_status) === '1') {
  //     keyboard.inline_keyboard.push([{
  //       text: `${performer.assignee_name}`,
  //       callback_data: `${ET_MENU.CHOSEN_PERFORMER}*${performer.assignee_id}`,
  //     }])
  //   }
  // })

  // keyboard.inline_keyboard.push(BACK_ET_MENU_KEYBOARD.inline_keyboard[0]);

  // await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot });
}

export async function showAvailabelPerformer({ response, phrase, user, bot }) {
  if (!user.getSubTask().getProject()) {
    await telegramBot.editMessage({
      msg: response,
      phrase: PHRASES.REFINE_PROJECT,
      user,
      keyboard: BACK_CST_MENU_KEYBOARD,
      bot
    })
    user.setState('deleter')
    return
  }

  let flag = false

  let keyboard = {
    inline_keyboard: [],
  };
  const usersRights = await googleSheet.getDataFromSheet({
    tableName: TABLE_NAMES.TABLE_USERS,
    tableRange: TABLE_RANGE.TABLE_USERS_RANGE
  })
  const projectRights = await googleSheet.getDataFromSheet({
    tableName: TABLE_NAMES.TABLE_PROJECTS,
    tableRange: TABLE_RANGE.TABLE_PROJECTS_RANGE
  })

  for (let i = 0; i < projectRights.length; i++) {

    console.log("projectRights[i].project_name: ", projectRights[i].project_name);
    console.log("projectRights[i].tlgm_id: ", projectRights[i].tlgm_id);
    console.log("user.getTask().getProject(): ", user.getTask().getProject());
    console.log("user.getUserId(): ", user.getUserId());

    if (
      String(projectRights[i].project_name) === String(user.getSubTask().getProject()) &&
      String(projectRights[i].tlgm_id) === String(user.getUserId())
    ) {
      flag = true
      break
    }
  }

  usersRights.forEach(async (userRight) => {
    if (
      String(userRight.tlgm_id) === String(user.getUserId()) &&
      userRight.project_name === user.getSubTask().getProject() &&
      flag
      ) {
      keyboard.inline_keyboard.push([{
        text: `${userRight.assignee_name}`,
        callback_data: `${CST_MENU.CHOSEN_STASK_PERFORMER}*${userRight.assignee_id}`,
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


  // let keyboard = {
  //   inline_keyboard: [],
  // };

  // const performers = await googleSheet.getDataFromSheet({
  //   tableName: TABLE_NAMES.TABLE_USERS,
  //   tableRange: TABLE_RANGE.TABLE_USERS_RANGE
  // })

  // performers.forEach(async (performer) => {
  //   if (
  //     String(user.getUserId()) === String(performer.tlgm_id) &&
  //     String(performer.performer_status) === '1'
  //   ) {
  //     keyboard.inline_keyboard.push([{
  //       text: `${performer.assignee_name}`,
  //       callback_data: `${CST_MENU.CHOSEN_STASK_PERFORMER}*${performer.assignee_id}`,
  //     }])
  //   }
  // })

  // keyboard.inline_keyboard.push([
  //   {
  //     text: 'Назад',
  //     callback_data: CST_MENU.BACK_MAIN_MENU,
  //   },
  // ]);

  // await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot });
}

export async function showAvailabelPerformerEdit({ response, phrase, user, bot }) {
  if (!user.getSubTask().getProject()) {
    await telegramBot.editMessage({
      msg: response,
      phrase: PHRASES.REFINE_PROJECT,
      user,
      keyboard: BACK_EST_MENU_KEYBOARD,
      bot
    })
    user.setState('deleter')
    return
  }

  let flag = false

  let keyboard = {
    inline_keyboard: [],
  };
  const usersRights = await googleSheet.getDataFromSheet({
    tableName: TABLE_NAMES.TABLE_USERS,
    tableRange: TABLE_RANGE.TABLE_USERS_RANGE
  })
  const projectRights = await googleSheet.getDataFromSheet({
    tableName: TABLE_NAMES.TABLE_PROJECTS,
    tableRange: TABLE_RANGE.TABLE_PROJECTS_RANGE
  })

  for (let i = 0; i < projectRights.length; i++) {

    // console.log("projectRights[i].project_name: ", projectRights[i].project_name);
    // console.log("projectRights[i].tlgm_id: ", projectRights[i].tlgm_id);
    // console.log("user.getTask().getProject(): ", user.getTask().getProject());
    // console.log("user.getUserId(): ", user.getUserId());

    if (
      String(projectRights[i].project_name) === String(user.getSubTask().getProject()) &&
      String(projectRights[i].tlgm_id) === String(user.getUserId())
    ) {
      flag = true
      break
    }
  }

  usersRights.forEach(async (userRight) => {
    if (
      String(userRight.tlgm_id) === String(user.getUserId()) &&
      userRight.project_name === user.getSubTask().getProject() &&
      flag
      ) {
      keyboard.inline_keyboard.push([{
        text: `${userRight.assignee_name}`,
        callback_data: `${EST_MENU.CHOSEN_PERFORMER}*${userRight.assignee_id}`,
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


  // let keyboard = {
  //   inline_keyboard: [],
  // };

  // const performers = await googleSheet.getDataFromSheet({
  //   tableName: TABLE_NAMES.TABLE_USERS,
  //   tableRange: TABLE_RANGE.TABLE_USERS_RANGE
  // })

  // performers.forEach(async (performer) => {
  //   if (
  //     String(user.getUserId()) === String(performer.tlgm_id) &&
  //     String(performer.performer_status) === '1'
  //   ) {
  //     keyboard.inline_keyboard.push([{
  //       text: `${performer.assignee_name}`,
  //       callback_data: `${EST_MENU.CHOSEN_PERFORMER}*${performer.assignee_id}`,
  //     }])
  //   }
  // })

  // keyboard.inline_keyboard.push([
  //   {
  //     text: 'Назад',
  //     callback_data: EST_MENU.BACK_EST_MENU,
  //   },
  // ]);

  // await telegramBot.editMessage({ msg: response, phrase, user, keyboard, bot });
}

export async function showAvailabelProject ({ response, phrase, user, extra = '', bot }) { 
  user.getTask().setPerformer('')
  let keyboard = {
    inline_keyboard: [],
  };
  const projectRights = await googleSheet.getDataFromSheet({
    tableName: TABLE_NAMES.TABLE_PROJECTS,
    tableRange: TABLE_RANGE.TABLE_PROJECTS_RANGE
  })
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
    
    // case MAIN_COMMANDS.ENTER_ADMIN_PANEL: {
    //   await cbqAdminPanelMenu({ response, user, bot })
    //   break
    // }
  }
}