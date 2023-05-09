export const MAIN_KEYBOARD = {
  inline_keyboard: [
    [{
      text: 'Мои задачи',
      callback_data: 'show_my_tasks'
    }, {
      text: 'Создать задачу',
      callback_data: 'create_task',
    }], [{
      text: 'Назначенные задачи',
      callback_data: 'show_all_projects'
    }, {
      text: 'Мой id',
      callback_data: 'get_telegram_id',
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
        text: 'Выбрать асистента',
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
        callback_data: 'choose_project'
      }
    ],
    [
      {
        text: 'Заголовок',
        callback_data: 'input_header',
      },
      {
        text: 'Описание',
        callback_data: 'input_description',
      },
      {
        text: 'Приоритет',
        callback_data: 'choose_priority',
      },
    ],
    [
      {
        text: 'Выбрать исполнителя',
        callback_data: 'choose_performer',
      },
    ],
    [
      {
        text: 'Завершить',
        callback_data: 'finish_task',
      },
      {
        text: 'Отменить',
        callback_data: 'cancel_task',
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

export const CHOOSE_PRIORITY_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Срочное',
        callback_data: 'chosen_priotiry*Срочное',
      },
      {
        text: 'Важное',
        callback_data: 'chosen_priotiry*Важное',
      },
    ],
    [
      {
        text: 'Срочное важное',
        callback_data: 'chosen_priotiry*Срочное важное',
      },
      {
        text: 'Без приоритета',
        callback_data: 'chosen_priotiry*Без приоритета',
      },
    ],
  ],
};


// TODO : Обязательно поменять при изменения названия отделов в бд
export const CHOOSE_BROOT_FORCE_KEYBOARD_MAIN = {
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
      text: 'Назад',
      callback_data: 'back_to_main_menu',
    }],
  ],
}

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
      text: 'Назад',
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

export const BACK_CREATE_TASK_MENU_KEYBOARD = {
  inline_keyboard: [
    [
      {
        text: 'Назад',
        callback_data: 'back_create_task_menu',
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