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
      callback_data: 'show_other_tasks'
    }, {
      text: 'Мой id',
      callback_data: 'get_telegram_id',
    }],
  ],
}

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
    // [
    //   {
    //     text: 'Выбрать исполнителя',
    //     callback_data: 'choose_performer',
    //   },
    //   {
    //     text: 'Выбрать асистента',
    //     callback_data: 'choose_asistant',
    //   },
    // ],
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