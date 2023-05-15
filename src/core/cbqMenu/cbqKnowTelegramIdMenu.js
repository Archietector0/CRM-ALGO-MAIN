import { telegramBot } from "../../telegram/TelegramBot.js";
import { KTGI_MENU } from "../../telegram/constants/constants.js";
import { BACK_MAIN_MENU_KEYBOARD, MAIN_KEYBOARD } from "../../telegram/constants/keyboards.js";

export async function cbqKnowTelegramIdMenu({ response, user, bot }) {
  const command = (user.state.split('*'))[1];
  
  const knowTgId = KTGI_MENU.KTGI_COMMAND.split('*')[1]
  const backMainMenu = KTGI_MENU.BACK_MAIN_MENU.split('*')[1]

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
      user.state = 'deleter'
      break
    } case backMainMenu: {
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
      await telegramBot.editMessage({ msg: response, phrase, user, keyboard: MAIN_KEYBOARD, bot })
      user.state = 'deleter'
      break
    }
  }
}