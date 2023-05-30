import { telegramBot } from "../../telegram/TelegramBot.js";
import { GA_MENU, KTGI_MENU } from "../../telegram/constants/constants.js";
import { BACK_MAIN_MENU_KEYBOARD, MAIN_KEYBOARD } from "../../telegram/constants/keyboards.js";
import { deepClone } from "../helper.js";

export async function cbqKnowTelegramIdMenu({ response, user, bot }) {
  const command = (user.getState().split('*'))[1];
  const knowTgId = KTGI_MENU.KTGI_COMMAND.split('*')[1]
  const backMainMenu = KTGI_MENU.BACK_MAIN_MENU.split('*')[1]

  console.log('command: ', command);

  console.log('knowTgId: ', knowTgId);

  console.log('backMainMenu: ', backMainMenu);

  switch (command) {
    case knowTgId: {
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nТвой телеграм-id: ${user.getUserId()}`
      await telegramBot.editMessage({
        msg: response,
        phrase,
        user,
        keyboard: BACK_MAIN_MENU_KEYBOARD,
        bot
      })
      user.setState('deleter')
      break
    } case backMainMenu: {
      let mainKeyboard = deepClone(MAIN_KEYBOARD)
      let adminId = process.env.ADMIN_ID
      let usersActivityBtn = [{
        text: 'Скачать активность юзеров',
        callback_data: `${GA_MENU.GA_COMMAND}`,
      }]

      if (String(adminId) === String(user.getUserId()))
        mainKeyboard.inline_keyboard.push(usersActivityBtn)
      
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: mainKeyboard, bot })
      user.setState('deleter')
      break
    }
  }
}