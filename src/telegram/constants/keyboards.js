import {
  CST_MENU,
  CT_MENU,
  SAG_MENU,
  KTGI_MENU,
  ET_MENU
} from "./constants.js";

export const MAIN_KEYBOARD = {
  inline_keyboard: [
    [{
      text: 'Мои задачи',
      callback_data: 'show_my_tasks'
    }, {
      text: 'Создать задачу',
      callback_data: CT_MENU.CT_COMMAND,
    }], [{
      text: 'Назначенные задачи',
      callback_data: SAG_MENU.SAG_COMMAND
    }, {
      text: 'Мой id',
      callback_data: KTGI_MENU.KTGI_COMMAND,
    }],
  ],
}

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
      {
        text: 'Выбрать создателя',
        callback_data: CST_MENU.CHOOSE_STASK_ASSISTANT,
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
      {
        text: 'Изм. приоритет',
        callback_data: ET_MENU.EDIT_PRIORITY,
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
        callback_data: 'f',
      },
      {
        text: 'Отменить',
        callback_data: ET_MENU.CANCEL_ET,
      },
    ],
  ],
};


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



// TODO : Обязательно поменять при изменения названия отделов в бд
export const CHOOSE_PROJECT_KEYBOARD_MAIN = Object.freeze({
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
    }], [{
      text: 'Главное меню',
      callback_data: SAG_MENU.BACK_MAIN_MENU
    }]
  ],
})

export const CHOOSE_PROJECT_EMPTY_KEYBOARD = Object.freeze({
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
    }], [{
      text: 'Нет тасок в отделе',
      callback_data: 'NOPE_TASKS'
    }], [{
      text: 'Главное меню',
      callback_data: SAG_MENU.BACK_MAIN_MENU
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



// export const STATUSES = {
//   inline_keyboard: [
//     [{
//       text: 'В работу',
//       callback_data: 'take_in_work'
//     }, {
//       text: 'На соглосование',
//       callback_data: 'sendto_judje'
//     }], [{
//       text: 'Назад',
//       callback_data: 'back_to_main_menu',
//     }],
//   ],
// }