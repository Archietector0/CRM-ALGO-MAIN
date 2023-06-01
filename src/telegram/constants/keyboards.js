import { deepClone } from "../../core/helper.js";
import { getAssignedUserGoals, getCurrentUserGoals } from "../../db/constants/constants.js";
import {
  CST_MENU,
  CT_MENU,
  SAG_MENU,
  KTGI_MENU,
  ET_MENU,
  STATUSES,
  EST_MENU,
  SCG_MENU,
  GA_MENU,
  DEPARTURES
} from "./constants.js";

export async function genMetricsKeyboard (user) {
  const userId = user.getUserId()
  const taskTableName = process.env.DB_TASK_TABLE_NAME
  const subTaskTableName = process.env.DB_SUBTASK_TABLE_NAME


  if (user.getState().split('*')[0] === 'SCG') {
    const userTasks = await getCurrentUserGoals({
      tableName: taskTableName,
      roleId: userId
    })
    const userSubTasks = await getCurrentUserGoals({
      tableName: subTaskTableName,
      roleId: userId
    })
  
    userTasks.forEach( async (userTask) => {
      if (String(userTask.performer_id) === String(user.getUserId()) &&
          String(userTask.project_name) === String(DEPARTURES.ACCOUNTS)) {
        user.goalMetrics.accounts++
      } else if (
          String(userTask.performer_id) === String(user.getUserId()) &&
          String(userTask.project_name) === String(DEPARTURES.OFFICE)) {
        user.goalMetrics.office++
      } else if (
          String(userTask.performer_id) === String(user.getUserId()) &&
          String(userTask.project_name) === String(DEPARTURES.PARSER)) {
        user.goalMetrics.parser++
      } else if (
          String(userTask.performer_id) === String(user.getUserId()) &&
          String(userTask.project_name) === String(DEPARTURES.TECH_SUPPORT)) {
        user.goalMetrics.tech_support++
      } else if (
          String(userTask.performer_id) === String(user.getUserId()) &&
          String(userTask.project_name) === String(DEPARTURES.ANALYTICS)) {
        user.goalMetrics.analytics++
      } else if (
          String(userTask.performer_id) === String(user.getUserId()) &&
          String(userTask.project_name) === String(DEPARTURES.PROXY)) {
        user.goalMetrics.proxy++
      }
    })
  
    userSubTasks.forEach( async (userSubTask) => {
      if (String(userSubTask.performer_id) === String(user.getUserId()) &&
          String(userSubTask.project_name) === String(DEPARTURES.ACCOUNTS)) {
        user.goalMetrics.accounts++
      } else if (
          String(userSubTask.performer_id) === String(user.getUserId()) &&
          String(userSubTask.project_name) === String(DEPARTURES.OFFICE)) {
        user.goalMetrics.office++
      } else if (
          String(userSubTask.performer_id) === String(user.getUserId()) &&
          String(userSubTask.project_name) === String(DEPARTURES.PARSER)) {
        user.goalMetrics.parser++
      } else if (
          String(userSubTask.performer_id) === String(user.getUserId()) &&
          String(userSubTask.project_name) === String(DEPARTURES.TECH_SUPPORT)) {
        user.goalMetrics.tech_support++
      } else if (
          String(userSubTask.performer_id) === String(user.getUserId()) &&
          String(userSubTask.project_name) === String(DEPARTURES.ANALYTICS)) {
        user.goalMetrics.analytics++
      } else if (
          String(userSubTask.performer_id) === String(user.getUserId()) &&
          String(userSubTask.project_name) === String(DEPARTURES.PROXY)) {
        user.goalMetrics.proxy++
      }
    })
  } else if (user.getState().split('*')[0] === 'SAG') {
    const userTasks = await getAssignedUserGoals({
      tableName: taskTableName,
      roleId: userId
    })
    const userSubTasks = await getAssignedUserGoals({
      tableName: subTaskTableName,
      roleId: userId
    })

    userTasks.forEach( async (userTask) => {
      if (String(userTask.senior_id) === String(user.getUserId()) &&
          String(userTask.project_name) === String(DEPARTURES.ACCOUNTS)) {
        user.goalMetrics.accounts++
      } else if (
          String(userTask.senior_id) === String(user.getUserId()) &&
          String(userTask.project_name) === String(DEPARTURES.OFFICE)) {
        user.goalMetrics.office++
      } else if (
          String(userTask.senior_id) === String(user.getUserId()) &&
          String(userTask.project_name) === String(DEPARTURES.PARSER)) {
        user.goalMetrics.parser++
      } else if (
          String(userTask.senior_id) === String(user.getUserId()) &&
          String(userTask.project_name) === String(DEPARTURES.TECH_SUPPORT)) {
        user.goalMetrics.tech_support++
      } else if (
          String(userTask.senior_id) === String(user.getUserId()) &&
          String(userTask.project_name) === String(DEPARTURES.ANALYTICS)) {
        user.goalMetrics.analytics++
      } else if (
          String(userTask.senior_id) === String(user.getUserId()) &&
          String(userTask.project_name) === String(DEPARTURES.PROXY)) {
        user.goalMetrics.proxy++
      }
    })
  
    userSubTasks.forEach( async (userSubTask) => {
      if (String(userSubTask.senior_id) === String(user.getUserId()) &&
          String(userSubTask.project_name) === String(DEPARTURES.ACCOUNTS)) {
        user.goalMetrics.accounts++
      } else if (
          String(userSubTask.senior_id) === String(user.getUserId()) &&
          String(userSubTask.project_name) === String(DEPARTURES.OFFICE)) {
        user.goalMetrics.office++
      } else if (
          String(userSubTask.senior_id) === String(user.getUserId()) &&
          String(userSubTask.project_name) === String(DEPARTURES.PARSER)) {
        user.goalMetrics.parser++
      } else if (
          String(userSubTask.senior_id) === String(user.getUserId()) &&
          String(userSubTask.project_name) === String(DEPARTURES.TECH_SUPPORT)) {
        user.goalMetrics.tech_support++
      } else if (
          String(userSubTask.senior_id) === String(user.getUserId()) &&
          String(userSubTask.project_name) === String(DEPARTURES.ANALYTICS)) {
        user.goalMetrics.analytics++
      } else if (
          String(userSubTask.senior_id) === String(user.getUserId()) &&
          String(userSubTask.project_name) === String(DEPARTURES.PROXY)) {
        user.goalMetrics.proxy++
      }
    })
  }


  const result = deepClone({
    inline_keyboard: [
      [{
        text: '*',
        callback_data: 'left_arrow',
      }, {
        text: `${user.goalMetrics.accounts}`,
        callback_data: `empty`,
      }, {
        text: `${user.goalMetrics.office}`,
        callback_data: `empty`,
      }, {
        text: `${user.goalMetrics.parser}`,
        callback_data: `empty`,
      }, {
        text: `${user.goalMetrics.tech_support}`,
        callback_data: `empty`,
      }, {
        text: `${user.goalMetrics.analytics}`,
        callback_data: `empty`,
      }, {
        text: `${user.goalMetrics.proxy}`,
        callback_data: `empty`,
      }, {
        text: '*',
        callback_data: 'right_arrow',
      }], [{
        text: 'Главное меню',
        callback_data: SAG_MENU.BACK_MAIN_MENU
      }]
    ],
  })

  user.goalMetrics.accounts = 0
  user.goalMetrics.office = 0
  user.goalMetrics.parser = 0
  user.goalMetrics.tech_support = 0
  user.goalMetrics.analytics = 0
  user.goalMetrics.proxy = 0

  return result
}



export const MAIN_KEYBOARD = Object.freeze({
  inline_keyboard: [
    [{
      text: 'Мне назначили',
      callback_data: SCG_MENU.SCG_COMMAND
    }, {
      text: 'Создать задачу',
      callback_data: CT_MENU.CT_COMMAND,
    }], [{
      text: 'Я назначил',
      callback_data: SAG_MENU.SAG_COMMAND
    }, {
      text: 'Мой id',
      callback_data: KTGI_MENU.KTGI_COMMAND,
    }],
  ],
})

export const FILTERS_KEYBOARD = Object.freeze({
  inline_keyboard: [
    [{
      text: 'Выбрать сотрудника',
      callback_data: `${GA_MENU.CHOOSE_EMPLOYEE}`
    }, {
      text: 'Выбрать период',
      callback_data: `${GA_MENU.CHOOSE_PERIOD}`,
    }], [{
      text: 'Выгрузить',
      callback_data: `${GA_MENU.UPLOAD_ACTIVITY}`,
    }, {
      text: 'Назад',
      callback_data: `${GA_MENU.BACK_MAIN_MENU}`,
    }],
  ],
})

export const TIME_RANGE_KEYBOARD = Object.freeze({
  inline_keyboard: [
    [{
      text: 'Час',
      callback_data: `${GA_MENU.CHOSEN_PERIOD}*1`
    }, {
      text: 'Сутки',
      callback_data: `${GA_MENU.CHOSEN_PERIOD}*24`,
    }, {
      text: 'Неделя',
      callback_data: `${GA_MENU.CHOSEN_PERIOD}*168`
    }], [{
      text: 'Месяц',
      callback_data: `${GA_MENU.CHOSEN_PERIOD}*336`
    }, {
      text: 'Все время',
      callback_data: `${GA_MENU.CHOSEN_PERIOD}*all_time`
    }], [{
      text: 'Назад',
      callback_data: `${GA_MENU.BACK_CHOOSE_FILTERS}`,
    }],
  ],
})

export const CREATE_SUBTASK_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Заголовок',
        callback_data: CST_MENU.INPUT_STASK_HEADER,
      },
      {
        text: 'Описание',
        callback_data: CST_MENU.INPUT_STASK_DESC,
      },
      {
        text: 'Приоритет',
        callback_data: CST_MENU.CHOOSE_STASK_PRIORITY,
      },
    ],
    [
      {
        text: 'Выбрать исполнителя',
        callback_data: CST_MENU.CHOOSE_STASK_PERFORMER,
      },
    ],
    [
      {
        text: 'Завершить',
        callback_data: CST_MENU.FINISH_STASK,
      },
      {
        text: 'Отменить',
        callback_data: CST_MENU.CANCEL_STASK,
      },
    ],
  ],
};

export const CREATE_TASK_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Выбрать проект',
        callback_data: CT_MENU.CHOOSE_PROJECT
      }
    ],
    [
      {
        text: 'Заголовок',
        callback_data: CT_MENU.INPUT_TASK_HEADER,
      },
      {
        text: 'Описание',
        callback_data: CT_MENU.INPUT_TASK_DESC,
      },
      {
        text: 'Приоритет',
        callback_data: CT_MENU.CHOOSE_PRIORITY,
      },
    ],
    [
      {
        text: 'Выбрать исполнителя',
        callback_data: CT_MENU.CHOOSE_PERFORMER,
      },
    ],
    [
      {
        text: 'Завершить',
        callback_data: CT_MENU.FINISH_TASK,
      },
      {
        text: 'Отменить',
        callback_data: CT_MENU.CANCEL_TASK,
      },
    ],
  ],
};

export const EDIT_TASK_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Ред. заголовок',
        callback_data: ET_MENU.EDIT_HEADER,
      },
      {
        text: 'Ред. описание',
        callback_data: ET_MENU.EDIT_DESC,
      },
    ],
    [
      {
        text: 'Изм. приоритет',
        callback_data: ET_MENU.EDIT_PRIORITY,
      },
      {
        text: 'Изм. статус',
        callback_data: ET_MENU.EDIT_STATUS,
      },
    ],
    [
      {
        text: 'Выбрать исполнителя',
        callback_data: ET_MENU.EDIT_PERFORMER,
      },
    ],
    [
      {
        text: 'Завершить',
        callback_data: ET_MENU.FINISH_EDIT,
      },
      {
        text: 'Отменить',
        callback_data: ET_MENU.CANCEL_ET,
      },
    ],
  ],
};

export const EDIT_SUBTASK_KEYBOARD = Object.freeze({
  inline_keyboard: [
    [
      {
        text: 'Ред. заголовок',
        callback_data: EST_MENU.EDIT_HEADER,
      },
      {
        text: 'Ред. описание',
        callback_data: EST_MENU.EDIT_DESC,
      },
    ],
    [
      {
        text: 'Изм. приоритет',
        callback_data: EST_MENU.EDIT_PRIORITY,
      },
      {
        text: 'Изм. статус',
        callback_data: EST_MENU.EDIT_STATUS,
      },
    ],
    [
      {
        text: 'Выбрать исполнителя',
        callback_data: EST_MENU.EDIT_PERFORMER,
      },
    ],
    [
      {
        text: 'Завершить',
        callback_data: EST_MENU.FINISH_EDIT,
      },
      {
        text: 'Отменить',
        callback_data: EST_MENU.CANCEL_EST,
      },
    ],
  ],
});


export const CHOOSE_SUBTASK_PRIORITY_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Срочное',
        callback_data: `${CST_MENU.CHOSEN_STASK_PRIORITY}*Срочное`,
      },
      {
        text: 'Важное',
        callback_data: `${CST_MENU.CHOSEN_STASK_PRIORITY}*Важное`,
      },
    ],
    [
      {
        text: 'Срочное важное',
        callback_data: `${CST_MENU.CHOSEN_STASK_PRIORITY}*Срочное важное`,
      },
      {
        text: 'Без приоритета',
        callback_data: `${CST_MENU.CHOSEN_STASK_PRIORITY}*Без приоритета`,
      },
    ],
  ],
};

export const CHOOSE_TASK_PRIORITY_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Срочное',
        callback_data: `${CT_MENU.CHOSEN_PRIORITY}*Срочное`,
      },
      {
        text: 'Важное',
        callback_data: `${CT_MENU.CHOSEN_PRIORITY}*Важное`,
      },
    ],
    [
      {
        text: 'Срочное важное',
        callback_data: `${CT_MENU.CHOSEN_PRIORITY}*Срочное важное`,
      },
      {
        text: 'Без приоритета',
        callback_data: `${CT_MENU.CHOSEN_PRIORITY}*Без приоритета`,
      },
    ],
  ],
};

export const EDIT_TASK_PRIORITY_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Срочное',
        callback_data: `${ET_MENU.CHOSEN_PRIORITY}*Срочное`,
      },
      {
        text: 'Важное',
        callback_data: `${ET_MENU.CHOSEN_PRIORITY}*Важное`,
      },
    ],
    [
      {
        text: 'Срочное важное',
        callback_data: `${ET_MENU.CHOSEN_PRIORITY}*Срочное важное`,
      },
      {
        text: 'Без приоритета',
        callback_data: `${ET_MENU.CHOSEN_PRIORITY}*Без приоритета`,
      },
    ],
  ],
};

export const EDIT_SUBTASK_PRIORITY_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Срочное',
        callback_data: `${EST_MENU.CHOSEN_PRIORITY}*Срочное`,
      },
      {
        text: 'Важное',
        callback_data: `${EST_MENU.CHOSEN_PRIORITY}*Важное`,
      },
    ],
    [
      {
        text: 'Срочное важное',
        callback_data: `${EST_MENU.CHOSEN_PRIORITY}*Срочное важное`,
      },
      {
        text: 'Без приоритета',
        callback_data: `${EST_MENU.CHOSEN_PRIORITY}*Без приоритета`,
      },
    ],
  ],
};

// TODO : Обязательно поменять при изменения названия отделов в бд
export const AG_SHORTCUT_BAR = Object.freeze({
  inline_keyboard: [
    [{
      text: '<',
      callback_data: 'left_arrow',
    }, {
      text: '🧮 Бухгалтерия',
      callback_data: `${SAG_MENU.CHOSEN_PROJECT}*${DEPARTURES.ACCOUNTS}`,
    }, {
      text: '🗄 Офис',
      callback_data: `${SAG_MENU.CHOSEN_PROJECT}*${DEPARTURES.OFFICE}`,
    }, {
      text: '🖥 Парсер',
      callback_data: `${SAG_MENU.CHOSEN_PROJECT}*${DEPARTURES.PARSER}`,
    }, {
      text: '🔌 ТП',
      callback_data: `${SAG_MENU.CHOSEN_PROJECT}*${DEPARTURES.TECH_SUPPORT}`,
    }, {
      text: '📊 Аналитика',
      callback_data: `${SAG_MENU.CHOSEN_PROJECT}*${DEPARTURES.ANALYTICS}`,
    }, {
      text: '🗑 Прокси',
      callback_data: `${SAG_MENU.CHOSEN_PROJECT}*${DEPARTURES.PROXY}`,
    }, {
      text: '>',
      callback_data: 'right_arrow',
    }]
  ],
})

export const CG_SHORTCUT_BAR = Object.freeze({
  inline_keyboard: [
    [{
      text: '<',
      callback_data: 'left_arrow',
    }, {
      text: '🧮 Бухгалтерия',
      callback_data: `${SCG_MENU.CHOSEN_PROJECT}*${DEPARTURES.ACCOUNTS}`,
    }, {
      text: '🗄 Офис',
      callback_data: `${SCG_MENU.CHOSEN_PROJECT}*${DEPARTURES.OFFICE}`,
    }, {
      text: '🖥 Парсер',
      callback_data: `${SCG_MENU.CHOSEN_PROJECT}*${DEPARTURES.PARSER}`,
    }, {
      text: '🔌 ТП',
      callback_data: `${SCG_MENU.CHOSEN_PROJECT}*${DEPARTURES.TECH_SUPPORT}`,
    }, {
      text: '📊 Аналитика',
      callback_data: `${SCG_MENU.CHOSEN_PROJECT}*${DEPARTURES.ANALYTICS}`,
    }, {
      text: '🗑 Прокси',
      callback_data: `${SCG_MENU.CHOSEN_PROJECT}*${DEPARTURES.PROXY}`,
    }, {
      text: '>',
      callback_data: 'right_arrow',
    }]
  ],
})

export const BACK_CT_MENU_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Назад',
        callback_data: CT_MENU.BACK_CT_MENU,
      },
    ],
  ],
}

export const BACK_ET_MENU_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Назад',
        callback_data: ET_MENU.BACK_ET_MENU,
      },
    ],
  ],
}

export const BACK_EST_MENU_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Назад',
        callback_data: EST_MENU.BACK_EST_MENU,
      },
    ],
  ],
}

export const BACK_MAIN_MENU_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Назад',
        callback_data: KTGI_MENU.BACK_MAIN_MENU,
      },
    ],
  ],
}

export const EDIT_TASK_STATUS_KEYBOARD = Object.freeze({
  inline_keyboard: [
    [{
      text: 'В работе',
      callback_data: `${ET_MENU.CHOSEN_STATUS}*${STATUSES.WORK}`,
    }, {
      text: 'Ожидание',
      callback_data: `${ET_MENU.CHOSEN_STATUS}*${STATUSES.WAIT}`,
    }], [{
      text: 'Согласование',
      callback_data: `${ET_MENU.CHOSEN_STATUS}*${STATUSES.DISCUSS}`,
    }, {
      text: 'Принять',
      callback_data: `${ET_MENU.CHOSEN_STATUS}*${STATUSES.ACCEPT}`,
    }], [{
      text: 'Завершена',
      callback_data: `${ET_MENU.CHOSEN_STATUS}*${STATUSES.FINISH}`,
    }, {
      text: 'Отменена',
      callback_data: `${ET_MENU.CHOSEN_STATUS}*${STATUSES.CANCEL}`,
    }], [{
      text: 'В архив',
      callback_data: `${ET_MENU.CHOSEN_STATUS}*${STATUSES.ARCHIVE}`,
    }, {
      text: 'Назад',
      callback_data: ET_MENU.BACK_ET_MENU,
    }],
  ],
})

export const EDIT_SUBTASK_STATUS_KEYBOARD = Object.freeze({
  inline_keyboard: [
    [{
      text: 'В работе',
      callback_data: `${EST_MENU.CHOSEN_STATUS}*${STATUSES.WORK}`,
    }, {
      text: 'Ожидание',
      callback_data: `${EST_MENU.CHOSEN_STATUS}*${STATUSES.WAIT}`,
    }], [{
      text: 'Согласование',
      callback_data: `${EST_MENU.CHOSEN_STATUS}*${STATUSES.DISCUSS}`,
    }, {
      text: 'Принять',
      callback_data: `${EST_MENU.CHOSEN_STATUS}*${STATUSES.ACCEPT}`,
    }], [{
      text: 'Завершена',
      callback_data: `${EST_MENU.CHOSEN_STATUS}*${STATUSES.FINISH}`,
    }, {
      text: 'Отменена',
      callback_data: `${EST_MENU.CHOSEN_STATUS}*${STATUSES.CANCEL}`,
    }], [{
      text: 'В архив',
      callback_data: `${EST_MENU.CHOSEN_STATUS}*${STATUSES.ARCHIVE}`,
    }, {
      text: 'Назад',
      callback_data: 'EDIT_SUBTASK_STATUS_KEYBOARD',
    }],
  ],
})

export const CHANGE_TASK_STATUS_KEYBOARD = {
  inline_keyboard: [
    [{
      text: 'На соглосование',
      callback_data: `${SCG_MENU.CHOSEN_TASK_STATUS}*${STATUSES.DISCUSS}`
    }], [{
      text: 'Принять',
      callback_data: `${SCG_MENU.CHOSEN_TASK_STATUS}*${STATUSES.ACCEPT}`
    }, {
      text: 'В архив',
      callback_data: `${SCG_MENU.CHOSEN_TASK_STATUS}*${STATUSES.ARCHIVE}`
    }], [{
      text: 'Назад',
      callback_data: "ET_MENU.BACK_ET_MENU",
    }],
  ],
}

export const CHANGE_SUBTASK_STATUS_KEYBOARD = {
  inline_keyboard: [
    [{
      text: 'На соглосование',
      callback_data: `${SCG_MENU.CHOSEN_STASK_STATUS}*${STATUSES.DISCUSS}`
    }], [{
      text: 'Принять',
      callback_data: `${SCG_MENU.CHOSEN_STASK_STATUS}*${STATUSES.ACCEPT}`
    }, {
      text: 'В архив',
      callback_data: `${SCG_MENU.CHOSEN_STASK_STATUS}*${STATUSES.ARCHIVE}`
    }], [{
      text: 'Назад',
      callback_data: `${SCG_MENU.BACK_CHOOSE_SUBTASK_MENU}`,
    }],
  ],
}