import { QueryTypes } from "sequelize";
import { logConn } from "../../db/constants/constants.js";
import { googleSheet } from "../../googleSheet/GoogleSheet.js";
import { TABLE_NAMES, TABLE_RANGE } from "../../googleSheet/constants/constants.js";
import { telegramBot } from "../../telegram/TelegramBot.js";
import { GA_MENU, PHRASES } from "../../telegram/constants/constants.js";
import { FILTERS_KEYBOARD, MAIN_KEYBOARD, TIME_RANGE_KEYBOARD } from "../../telegram/constants/keyboards.js";
import { deepClone } from "../helper.js";
import fs from 'fs/promises';

function convertToCSV(data) {
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => headers.map(header => obj[header]));
  const csvArray = [headers, ...rows];

  return csvArray.map(row => row.join(',')).join('\n');
}

function getUniqueObjects(data) {
  const uniqueObjects = {};

  data.forEach(obj => {
    const { name, tlgm_id } = obj;
    const key = `${name}-${tlgm_id}`;

    if (!uniqueObjects[key]) {
      uniqueObjects[key] = { name, tlgm_id };
    }
  });

  return Object.values(uniqueObjects);
}

async function getUpload({ employee, period }) {
  const tableName = process.env.DB_LOGS_TABLE_NAME

  if (employee === 'all_employee' && period === 'all_time') {
    return await logConn.query(`
    SELECT
      l.user_name,
      l.first_name,
      l.telegram_id,
      l.date,
      l.action,
      l.state,
      l.msg_text
    from
      ${tableName} l
    `, { type: QueryTypes.SELECT })
  } else if (employee !== 'all_employee' && period !== 'all_time') {
    return await logConn.query(`
    SELECT
      l.user_name,
      l.first_name,
      l.telegram_id,
      l.date,
      l.action,
      l.state,
      l.msg_text
    from
      ${tableName} l
    WHERE
      l.telegram_id = '${employee}'
      and l.date > now () - interval '${period} HOUR'
    `, { type: QueryTypes.SELECT })
  } else if (employee === 'all_employee' && period !== 'all_time') {
    return await logConn.query(`
    SELECT
      l.user_name,
      l.first_name,
      l.telegram_id,
      l.date,
      l.action,
      l.state,
      l.msg_text
    from
      ${tableName} l
    WHERE
      l.date > now () - interval '${period} HOUR'
    `, { type: QueryTypes.SELECT })
  } else if (employee !== 'all_employee' && period === 'all_time') {
    return await logConn.query(`
    SELECT
      l.user_name,
      l.first_name,
      l.telegram_id,
      l.date,
      l.action,
      l.state,
      l.msg_text
    from
      ${tableName} l
    WHERE
      l.telegram_id = '${employee}'
    `, { type: QueryTypes.SELECT })
  }
}

export async function cbqGetUsersActivity({ response, user, bot }) {
  const command = (user.getState().split('*'))[1];
  
  const getUsersActivity = GA_MENU.GA_COMMAND.split('*')[1]
  const chooseEmployee = GA_MENU.CHOOSE_EMPLOYEE.split('*')[1]
  const chosenEmployee = GA_MENU.CHOSEN_EMPLOYEE.split('*')[1]
  const choosePeriod = GA_MENU.CHOOSE_PERIOD.split('*')[1]
  const chosenPeriod = GA_MENU.CHOSEN_PERIOD.split('*')[1]


  const uploadActivity = GA_MENU.UPLOAD_ACTIVITY.split('*')[1]


  const backChooseFilters = GA_MENU.BACK_CHOOSE_FILTERS.split('*')[1]
  const backMainMenu = GA_MENU.BACK_MAIN_MENU.split('*')[1]


  // const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`


  switch(command) {
    case getUsersActivity: {
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСотрудник:\n\t\t${user.queryData.employee}\nПериод:\n\t\t${user.queryData.timeRange}`

      await telegramBot.editMessage({
        msg: response,
        phrase,
        user,
        keyboard: FILTERS_KEYBOARD,
        bot
      })
      user.setState('deleter')
      break

    } case chooseEmployee: {
      const usersList = await googleSheet.getDataFromSheet({
        tableName: TABLE_NAMES.TABLE_USERS,
        tableRange: TABLE_RANGE.TABLE_USERS_RANGE
      })
      const uniqUsersList = getUniqueObjects(usersList)
      let keyboard = {
        inline_keyboard: []
      }

      uniqUsersList.forEach(async (user) => {
        keyboard.inline_keyboard.push([
          {
            text: `${user.name}`,
            callback_data: `${GA_MENU.CHOSEN_EMPLOYEE}*${user.tlgm_id}`
          }
        ])
      })

      keyboard.inline_keyboard.push([{
        text: 'Все сотрудники',
        callback_data: `${GA_MENU.CHOSEN_EMPLOYEE}*all_employee`
      }, {
        text: 'Назад',
        callback_data: `${GA_MENU.BACK_CHOOSE_FILTERS}`
        }
      ])

      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_EMPLOYEE,
        user,
        keyboard,
        bot
      })
      user.setState('deleter')
      break
    } case chosenEmployee: {
      user.queryData.employee = response.data.split('*')[2]

      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСотрудник:\n\t\t${user.queryData.employee}\nПериод:\n\t\t${user.queryData.timeRange}`

      await telegramBot.editMessage({
        msg: response,
        phrase,
        user,
        keyboard: FILTERS_KEYBOARD,
        bot
      })
      user.setState('deleter')
      break
    } case choosePeriod: {
      await telegramBot.editMessage({
        msg: response,
        phrase: PHRASES.REFINE_PERIOD,
        user,
        keyboard: TIME_RANGE_KEYBOARD,
        bot
      })
      user.setState('deleter')
      break
    } case chosenPeriod: {
      user.queryData.timeRange = response.data.split('*')[2]
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСотрудник:\n\t\t${user.queryData.employee}\nПериод:\n\t\t${user.queryData.timeRange}`


      await telegramBot.editMessage({
        msg: response,
        phrase,
        user,
        keyboard: FILTERS_KEYBOARD,
        bot
      })

      user.setState('deleter')
      break
    } case uploadActivity: {

      const keyboard = {
        inline_keyboard: [
          [{
            text: 'Назад',
            callback_data: `${GA_MENU.BACK_CHOOSE_FILTERS}`,
          }],
        ],
      }

      if (!user.queryData.employee || !user.queryData.timeRange) {
        await telegramBot.editMessage({
          msg: response,
          phrase: PHRASES.INCORRECT_INPUT,
          user,
          keyboard,
          bot
        })
        user.setState('deleter')
        return
      }

      const activity = await getUpload({
        employee: user.queryData.employee,
        period: user.queryData.timeRange
      })

      if (activity.length) {
        await telegramBot.editMessage({
          msg: response,
          phrase: PHRASES.FULL_RESULT,
          user,
          keyboard,
          bot
        })

        const data = convertToCSV(activity)

        try {
          await fs.writeFile(`${user.queryData.employee}_${user.queryData.timeRange}_hour.csv`, data, 'utf8')
          await bot.sendDocument(user.getUserId(), `${user.queryData.employee}_${user.queryData.timeRange}_hour.csv`)
          await fs.unlink(`${user.queryData.employee}_${user.queryData.timeRange}_hour.csv`)
        } catch (e) {
          await telegramBot.editMessage({
            msg: response,
            phrase: `${e.message}`,
            user,
            keyboard: MAIN_KEYBOARD,
            bot
          })
        }
        

      } else {
        await telegramBot.editMessage({
          msg: response,
          phrase: PHRASES.EMPTY_RESULT,
          user,
          keyboard,
          bot
        })
      }

      user.queryData.employee = ''
      user.queryData.timeRange = ''
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

      await telegramBot.editMessage({ 
        msg: response,
        phrase,
        user,
        keyboard: mainKeyboard,
        bot
      })

      user.queryData.employee = ''
      user.queryData.timeRange = ''
      user.setState('deleter')
      break
    } case backChooseFilters: {
      const phrase = `💼 <b>CRM ALGO INC.</b>\n\nСотрудник:\n\t\t${user.queryData.employee}\nПериод:\n\t\t${user.queryData.timeRange}`


      await telegramBot.editMessage({
        msg: response,
        phrase,
        user,
        keyboard: FILTERS_KEYBOARD,
        bot
      })

      user.setState('deleter')
      break
    }
  }
}
