import { CT_MENU, SAG_MENU } from "./constants.js";
import { KTGI_MENU } from "./constants.js";

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
        callback_data: 'input_subtask_header',
      },
      {
        text: 'Описание',
        callback_data: 'input_subtask_description',
      },
      {
        text: 'Приоритет',
        callback_data: 'choose_subtask_priority',
      },
    ],
    [
      {
        text: 'Выбрать исполнителя',
        callback_data: 'choose_subtask_performer',
      },
      {
        text: 'Выбрать создателя',
        callback_data: 'choose_subtask_asistant',
      },
    ],
    [
      {
        text: 'Завершить',
        callback_data: 'finish_subtask',
      },
      {
        text: 'Отменить',
        callback_data: 'cancel_subtask',
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

export const CHOOSE_SUBTASK_PRIORITY_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Срочное',
        callback_data: 'chosen_subtask_priotiry*Срочное',
      },
      {
        text: 'Важное',
        callback_data: 'chosen_subtask_priotiry*Важное',
      },
    ],
    [
      {
        text: 'Срочное важное',
        callback_data: 'chosen_subtask_priotiry*Срочное важное',
      },
      {
        text: 'Без приоритета',
        callback_data: 'chosen_subtask_priotiry*Без приоритета',
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

export const CHOOSE_BF_SHOW_VERSION_KEYBOARD = {
  inline_keyboard: [
    [{
      text: '<',
      callback_data: 'left_arrow',
    }, {
      text: '🧮',
      callback_data: 'show_appointed_project*Бухгалтерия',
    }, {
      text: '🗄',
      callback_data: 'show_appointed_project*Офис',
    }, {
      text: '🖥',
      callback_data: 'show_appointed_project*Парсер',
    }, {
      text: '🔌',
      callback_data: 'show_appointed_project*ТП',
    }, {
      text: '📊',
      callback_data: 'show_appointed_project*Аналитика',
    }, {
      text: '🗑',
      callback_data: 'show_appointed_project*Прокси',
    }, {
      text: '>',
      callback_data: 'right_arrow',
    }], [{
      text: 'Главное меню',
      callback_data: 'back_to_main_menu',
    }],
  ],
}




export let CHOOSE_BROOT_FORCE_KEYBOARD_1 = {
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

export const BACK_CREATE_SUBTASK_MENU_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Назад',
        callback_data: 'back_create_subtask_menu',
      },
    ],
  ],
}

export const BACK_CHECK_APPOINTED_TASKS_MENU_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Назад',
        callback_data: 'back_check_appointed_tasks_menu',
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