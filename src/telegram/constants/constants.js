export const MAIN_COMMANDS = {
  CREATE_TASK: 'CREATE_TASK',
  EDIT_TASK: 'ET',
  NOTICE: 'NOTICE',
  EDIT_STASK: 'EST',
  CREATE_SUBTASK: 'CST',
  KNOW_TG_ID: 'KNOW_TG_ID',
  SHOW_AG: 'SHOW_GOAL',
  SHOW_CG: 'SHOW_CGOAL',
}

// CREATE TASK MENU
export const CT_MENU = {
  CT_COMMAND: `${MAIN_COMMANDS.CREATE_TASK}*CREATE_TASK`,
  INPUT_TASK_HEADER: `${MAIN_COMMANDS.CREATE_TASK}*INPUT_TASK_HEADER`,
  INPUT_TASK_DESC: `${MAIN_COMMANDS.CREATE_TASK}*INPUT_TASK_DESC`,
  CHOOSE_PRIORITY: `${MAIN_COMMANDS.CREATE_TASK}*CHOOSE_PRIORITY`,
  CHOSEN_PRIORITY: `${MAIN_COMMANDS.CREATE_TASK}*CHOSEN_PRIORITY`,
  CHOOSE_PERFORMER: `${MAIN_COMMANDS.CREATE_TASK}*CHOOSE_PERFORMER`,
  CHOSEN_PERFORMER: `${MAIN_COMMANDS.CREATE_TASK}*CHOSEN_PERFORMER`,
  CHOOSE_PROJECT: `${MAIN_COMMANDS.CREATE_TASK}*CHOOSE_PROJECT`,
  CHOSEN_PROJECT: `${MAIN_COMMANDS.CREATE_TASK}*CHOSEN_PROJECT`,
  FINISH_TASK: `${MAIN_COMMANDS.CREATE_TASK}*FINISH_TASK`,
  CANCEL_TASK: `${MAIN_COMMANDS.CREATE_TASK}*CANCEL_TASK`,
  BACK_CT_MENU: `${MAIN_COMMANDS.CREATE_TASK}*BACK_CT_MENU`
}

// CREATE SUBTASK MENU
export const CST_MENU = {
  CST_COMMAND: `${MAIN_COMMANDS.CREATE_SUBTASK}*CREATE_SUBTASK`,
  INPUT_STASK_HEADER: `${MAIN_COMMANDS.CREATE_SUBTASK}*INPUT_STASK_HEADER`,
  INPUT_STASK_DESC: `${MAIN_COMMANDS.CREATE_SUBTASK}*INPUT_STASK_DESC`,
  CHOOSE_STASK_PRIORITY: `${MAIN_COMMANDS.CREATE_SUBTASK}*CHOOSE_STASK_PRIORITY`,
  CHOSEN_STASK_PRIORITY: `${MAIN_COMMANDS.CREATE_SUBTASK}*CHOSEN_STASK_PRIORITY`,
  CHOOSE_STASK_PERFORMER: `${MAIN_COMMANDS.CREATE_SUBTASK}*CHOOSE_STASK_PERFORMER`,
  CHOSEN_STASK_PERFORMER: `${MAIN_COMMANDS.CREATE_SUBTASK}*CHOSEN_STASK_PERFORMER`,
  CHOOSE_STASK_ASSISTANT: `${MAIN_COMMANDS.CREATE_SUBTASK}*CHOOSE_STASK_ASSISTANT`,
  CHOSEN_STASK_ASSISTANT: `${MAIN_COMMANDS.CREATE_SUBTASK}*CHOSEN_STASK_ASSISTANT`,
  FINISH_STASK: `${MAIN_COMMANDS.CREATE_SUBTASK}*FINISH_STASK`,
  CANCEL_STASK: `${MAIN_COMMANDS.CREATE_SUBTASK}*CANCEL_STASK`,
  BACK_MAIN_MENU: `${MAIN_COMMANDS.CREATE_SUBTASK}*BACK_MAIN_MENU`

}

// EDIT TASK MENU
export const ET_MENU = {
  EDIT_TASK: `${MAIN_COMMANDS.EDIT_TASK}*EDIT_TASK`,
  EDIT_HEADER: `${MAIN_COMMANDS.EDIT_TASK}*EDIT_HEADER`,
  EDIT_DESC: `${MAIN_COMMANDS.EDIT_TASK}*EDIT_DESC`,
  EDIT_PRIORITY: `${MAIN_COMMANDS.EDIT_TASK}*EDIT_PRIORITY`,
  CHOSEN_PRIORITY: `${MAIN_COMMANDS.EDIT_TASK}*CHOSEN_PRIORITY`,
  EDIT_STATUS: `${MAIN_COMMANDS.EDIT_TASK}*EDIT_STATUS`,
  CHOSEN_STATUS: `${MAIN_COMMANDS.EDIT_TASK}*CHOSEN_STATUS`,
  EDIT_PERFORMER: `${MAIN_COMMANDS.EDIT_TASK}*EDIT_PERFORMER`,
  CHOSEN_PERFORMER: `${MAIN_COMMANDS.EDIT_TASK}*CHOSEN_PERFORMER`,

  FINISH_EDIT: `${MAIN_COMMANDS.EDIT_TASK}*FINISH_EDIT`,
  CANCEL_ET: `${MAIN_COMMANDS.EDIT_TASK}*CANCEL_ET`,
  BACK_ET_MENU: `${MAIN_COMMANDS.EDIT_TASK}*BACK_ET_MENU`,
}

// EDIT SUBTASK MENU
export const EST_MENU = {
  EDIT_STASK: `${MAIN_COMMANDS.EDIT_STASK}*EDIT_STASK`,
  EDIT_HEADER: `${MAIN_COMMANDS.EDIT_STASK}*EDIT_STASK_HEADER`,
  EDIT_DESC: `${MAIN_COMMANDS.EDIT_STASK}*EDIT_STASK_DESC`,
  EDIT_PRIORITY: `${MAIN_COMMANDS.EDIT_STASK}*EDIT_STASK_PRIORITY`,
  CHOSEN_PRIORITY: `${MAIN_COMMANDS.EDIT_STASK}*CHOSEN_STASK_PRIORITY`,
  EDIT_STATUS: `${MAIN_COMMANDS.EDIT_STASK}*EDIT_STASK_STATUS`,
  CHOSEN_STATUS: `${MAIN_COMMANDS.EDIT_STASK}*CHOSEN_STASK_STATUS`,
  EDIT_PERFORMER: `${MAIN_COMMANDS.EDIT_STASK}*EDIT_STASK_PERFORMER`,
  CHOSEN_PERFORMER: `${MAIN_COMMANDS.EDIT_STASK}*CHOSEN_STASK_PERFORMER`,

  FINISH_EDIT: `${MAIN_COMMANDS.EDIT_STASK}*FINISH_STASK_EDIT`,
  CANCEL_EST: `${MAIN_COMMANDS.EDIT_STASK}*CANCEL_EST`,
  BACK_EST_MENU: `${MAIN_COMMANDS.EDIT_STASK}*BACK_EST_MENU`,
}


// SHOW ASSIGNED GOAL MENU
export const SAG_MENU = {
  SAG_COMMAND: `${MAIN_COMMANDS.SHOW_AG}*SHOW_ASSIGNED_GOAL`,
  CHOSEN_PROJECT: `${MAIN_COMMANDS.SHOW_AG}*CHOSEN_PROJECT`,
  CHOSEN_TASK: `${MAIN_COMMANDS.SHOW_AG}*CHOSEN_TASK`,

  DELETE_TASK: `${MAIN_COMMANDS.SHOW_AG}*DELETE_TASK`,
  DELETE_SUBTASK: `${MAIN_COMMANDS.SHOW_AG}*DELETE_SUBTASK`,

  CHOSEN_STASK: `${MAIN_COMMANDS.SHOW_AG}*CHOSEN_STASK`,
  BACK_CHOOSE_SUBTASK_MENU:`${MAIN_COMMANDS.SHOW_AG}*BACK_CHST_MENU`,
  BACK_MAIN_MENU: `${MAIN_COMMANDS.SHOW_AG}*BACK_MAIN_MENU`
}

// SHOW CURRENT GOAL MENU
export const SCG_MENU = {
  SCG_COMMAND: `${MAIN_COMMANDS.SHOW_CG}*SHOW_CURRENT_GOAL`,
  CHOSEN_PROJECT: `${MAIN_COMMANDS.SHOW_CG}*CHOSEN_PROJECT`,
  CHOSEN_TASK: `${MAIN_COMMANDS.SHOW_CG}*CHOSEN_TASK`,
  CHOSEN_STASK: `${MAIN_COMMANDS.SHOW_CG}*CHOSEN_STASK`,

  CHANGE_TASK: `${MAIN_COMMANDS.SHOW_CG}*CHANGE_TASK`,
  CHANGE_STASK: `${MAIN_COMMANDS.SHOW_CG}*CHANGE_STASK`,

  CHOSEN_TASK_STATUS: `${MAIN_COMMANDS.SHOW_CG}*CHOSEN_TASK_STATUS`,
  CHOSEN_STASK_STATUS: `${MAIN_COMMANDS.SHOW_CG}*CHOSEN_STASK_STATUS`,




  // DELETE_TASK: `${MAIN_COMMANDS.SHOW_AG}*DELETE_TASK`,
  // DELETE_SUBTASK: `${MAIN_COMMANDS.SHOW_AG}*DELETE_SUBTASK`,

  BACK_CHOOSE_SUBTASK_MENU:`${MAIN_COMMANDS.SHOW_CG}*BACK_CHST_MENU`,
  // BACK_MAIN_MENU: `${MAIN_COMMANDS.SHOW_AG}*BACK_MAIN_MENU`
}

// KNOW TG_ID MENU
export const KTGI_MENU = {
  KTGI_COMMAND: `${MAIN_COMMANDS.KNOW_TG_ID}*KNOW_TG_ID`,
  BACK_MAIN_MENU: `${MAIN_COMMANDS.KNOW_TG_ID}*BACK_MAIN_MENU`
}

export const NOTIFICATION = {
  NOTE_USER_TASK: `${MAIN_COMMANDS.NOTICE}*NOTE_USER_TASK`,
  ACCEPT_TASK: `${MAIN_COMMANDS.NOTICE}*ACCEPT_TASK`,
  NOTE_USER_STASK: `${MAIN_COMMANDS.NOTICE}*NOTE_USER_STASK`,
  ACCEPT_STASK: `${MAIN_COMMANDS.NOTICE}*ACCEPT_STASK`,

}

export const PHRASES = {
  REFINE_HEADER: `💼 <b>CRM ALGO INC.</b>\n\nУточните заголовок:`,
  REFINE_DESC: `💼 <b>CRM ALGO INC.</b>\n\nУточните описание:`,
  REFINE_PRIORITY: `💼 <b>CRM ALGO INC.</b>\n\nУкажите приоритет:`,
  REFINE_PROJECT: `💼 <b>CRM ALGO INC.</b>\n\nВыбери проект:`,
  REFINE_STATUS: `💼 <b>CRM ALGO INC.</b>\n\nВыбери статус:`,
  REFINE_PERFORMER: `💼 <b>CRM ALGO INC.</b>\n\nВыбери исполнителя:`,
  REFINE_ASSISTANT: `💼 <b>CRM ALGO INC.</b>\n\nВыберите асистента:`,
  INCORRECT_INPUT: `💼 <b>CRM ALGO INC.</b>\n\nОдно из полей не заполнено, проверь`,
  // INCORRECT_INPUT: `💼 <b>CRM ALGO INC.</b>\n\nОдно из полей не заполнено, проверь`,

}

export const STATUSES = {
  ACCEPT: 'ACCEPT',
  DISCUSS: 'DISCUSS',
  ARCHIVE: 'ARCHIVE',
}