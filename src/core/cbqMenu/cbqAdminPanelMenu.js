// import { googleSheet } from "../../googleSheet/GoogleSheet.js";
// import { TABLE_NAMES, TABLE_RANGE } from "../../googleSheet/constants/constants.js";
// import { telegramBot } from "../../telegram/TelegramBot.js";
// import { EAP, GA_MENU, PHRASES } from "../../telegram/constants/constants.js";
// import { ADMIN_FILTERS_KEYBOARD, EAP_SHORTCUT_BAR, MAIN_KEYBOARD, genMetricsKeyboard } from "../../telegram/constants/keyboards.js";
// import { deepClone } from "../helper.js";

// export async function cbqAdminPanelMenu({ response, user, bot }) {
//   const command = (user.getState().split('*'))[1];

//   const enterAdminPanel = EAP.EAP_COMMAND.split('*')[1]
//   const showAllDepGoals = EAP.SHOW_ALL_DEP_GOALS.split('*')[1]
//   const chosenProject = EAP.CHOSEN_PROJECT.split('*')[1]
//   const backMainMenu = EAP.BACK_MAIN_MENU.split('*')[1]




//   switch(command) {
//     case enterAdminPanel: {
//       let adminPanelKeyboard = deepClone(ADMIN_FILTERS_KEYBOARD)

//       await telegramBot.editMessage({
//         msg: response,
//         phrase: PHRASES.REFINE_DREAMS,
//         user,
//         keyboard: adminPanelKeyboard,
//         bot
//       })

//       user.setState('deleter')
//       break
//     }

//     case showAllDepGoals: {
//       let eapShortCutBar = deepClone(EAP_SHORTCUT_BAR)
//       let metricsKeyboard = await genMetricsKeyboard(user)

//       eapShortCutBar.inline_keyboard.push(metricsKeyboard.inline_keyboard[0])
//       eapShortCutBar.inline_keyboard.push(metricsKeyboard.inline_keyboard[1])

//       await telegramBot.editMessage({
//         msg: response,
//         phrase: PHRASES.REFINE_PROJECT,
//         user,
//         keyboard: eapShortCutBar,
//         bot
//       })

//       user.setState('deleter')
//       break
//     }


//     case chosenProject: {
//       const projectValue = response.data.split('*')[2]

//       user.setState('deleter')
//       break
//     }



//     case backMainMenu: {
//       let mainKeyboard = deepClone(MAIN_KEYBOARD)
//       let adminId = process.env.ADMIN_ID
//       let usersActivityBtn = [{
//         text: 'Скачать активность юзеров',
//         callback_data: `${GA_MENU.GA_COMMAND}`,
//       }]
//       let adminPanelBtn = [{
//         text: 'Админ панель',
//         callback_data: `${EAP.EAP_COMMAND}`,
//       }]

//       let seniorsDepList = await googleSheet.getDataFromSheet({
//         tableName: TABLE_NAMES.TABLE_SENIOR_DEP,
//         tableRange: TABLE_RANGE.TABLE_SENIOR_DEP_RANGE
//       })

//       for (let i = 0; i < seniorsDepList.length; i++) {
//         if (String(seniorsDepList[i].senior_id) === String(user.getUserId())) {
//           mainKeyboard.inline_keyboard.push(adminPanelBtn)
//           break
//         }
//       }

//       if (String(adminId) === String(user.getUserId()))
//         mainKeyboard.inline_keyboard.push(usersActivityBtn)
      
//       const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`
//       await telegramBot.editMessage({ msg: response, phrase, user, keyboard: mainKeyboard, bot })
//       user.setState('deleter')
//       break
//     }
//   }
// }
