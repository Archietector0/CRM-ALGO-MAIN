import { QueryTypes } from "sequelize"
import { db } from "../DataBase.js"
import { telegramBot } from "../../telegram/TelegramBot.js"
import { MAIN_KEYBOARD } from "../../telegram/constants/keyboards.js"

export const taskConn = db.getConnection({
  DB_NAME: process.env.DB_TASK_NAME,
  DB_USERNAME: process.env.DB_TASK_USERNAME,
  DB_PASS: process.env.DB_TASK_PASS,
  DB_DIALECT: process.env.DB_TASK_DIALECT,
  DB_HOST: process.env.DB_TASK_HOST,
  DB_PORT: process.env.DB_TASK_PORT
})
export const taskImg = db.getImage({
  sequelize: taskConn,
  modelName: process.env.DB_TASK_TABLE_NAME
})

export const subTaskConn = db.getConnection({
  DB_NAME: process.env.DB_SUBTASK_NAME,
  DB_USERNAME: process.env.DB_SUBTASK_USERNAME,
  DB_PASS: process.env.DB_SUBTASK_PASS,
  DB_DIALECT: process.env.DB_SUBTASK_DIALECT,
  DB_HOST: process.env.DB_SUBTASK_HOST,
  DB_PORT: process.env.DB_SUBTASK_PORT
})

export const subTaskImg = db.getImage({
  sequelize: subTaskConn,
  modelName: process.env.DB_SUBTASK_TABLE_NAME
})

export const logConn = db.getConnection({
  DB_NAME: process.env.DB_LOGS_NAME,
  DB_USERNAME: process.env.DB_LOGS_USERNAME,
  DB_PASS: process.env.DB_LOGS_PASS,
  DB_DIALECT: process.env.DB_LOGS_DIALECT,
  DB_HOST: process.env.DB_LOGS_HOST,
  DB_PORT: process.env.DB_LOGS_PORT
})

export const logImg = db.getImage({
  sequelize: logConn,
  modelName: process.env.DB_LOGS_TABLE_NAME
})











// export async function getUsersList({ response, user, bot }) {
//   try {
//     const logTable = process.env.DB_LOGS_TABLE_NAME

//     return await logConn.query(`
//     SELECT distinct
//       l.first_name,
//       l.telegram_id
//     FROM
//       ${logTable} l
//     `, { type: QueryTypes.SELECT })
//   } catch (e) {
//     await telegramBot.editMessage({
//       msg: response,
//       phrase: `${e.message}`,
//       user,
//       keyboard: MAIN_KEYBOARD,
//       bot
//     })
//   }
// }




// export async function getPerformanceTasks ({ user, projectName, performerId }) {
//   try {
//     return await taskConn.query(`
//     SELECT
//       *
//     FROM
//       task_storage
//     WHERE
//       project_name = '${projectName}'
//       and performer_id = '${performerId}'
//     `, { type: QueryTypes.SELECT })
//   } catch (e) {
//     await telegramBot.editMessage({
//       msg: response,
//       phrase: `${e.message}`,
//       user,
//       keyboard: MAIN_KEYBOARD,
//       bot
//     })
//   }
// }

export async function getUserSubTasks (performerId) {
  try {
    return await taskConn.query(`
    SELECT
      *
    FROM
      subtasks_storage
    WHERE
      performer_id = '${performerId}'
    `, { type: QueryTypes.SELECT })
  } catch (e) {
    await telegramBot.editMessage({
      msg: response,
      phrase: `${e.message}`,
      user,
      keyboard: MAIN_KEYBOARD,
      bot
    })
  }
}

export async function getUserTasks (performerId) {
  try {
    return await taskConn.query(`
    SELECT
      *
    FROM
      task_storage
    WHERE
      performer_id = '${performerId}'
    `, { type: QueryTypes.SELECT })
  } catch (e) {
    await telegramBot.editMessage({
      msg: response,
      phrase: `${e.message}`,
      user,
      keyboard: MAIN_KEYBOARD,
      bot
    })
  }
}

export async function getPerformanceSubTasks ({ linkId, performerId }) {
  try {
    return await taskConn.query(`
    SELECT
      *
    FROM
      subtasks_storage
    WHERE
      link_id = '${linkId}'
      and performer_id = '${performerId}'
    `, { type: QueryTypes.SELECT })
  } catch (e) {
    await telegramBot.editMessage({
      msg: response,
      phrase: `${e.message}`,
      user,
      keyboard: MAIN_KEYBOARD,
      bot
    })
  }
}

export async function getCurrentUserTasks({ projectName, seniorId }) {
  try {
    return await taskConn.query(`
    SELECT
      *
    FROM
      task_storage
    WHERE
      project_name = '${projectName}'
      and senior_id = '${seniorId}'
    `, { type: QueryTypes.SELECT })
  } catch (e) {
    await telegramBot.editMessage({
      msg: response,
      phrase: `${e.message}`,
      user,
      keyboard: MAIN_KEYBOARD,
      bot
    })
  }
}

export async function getTaskById( linkId ) {
  try {
    return (await taskConn.query(`
    SELECT
      *
    FROM
      task_storage
    WHERE
      link_id = '${linkId}'
    `, { type: QueryTypes.SELECT }))[0]
  } catch (e) {
    await telegramBot.editMessage({
      msg: response,
      phrase: `${e.message}`,
      user,
      keyboard: MAIN_KEYBOARD,
      bot
    })
  }
}

export async function updateTaskById({ linkId, changes }) {
  try {
    return (await taskConn.query(`
    UPDATE
      ${process.env.DB_TASK_TABLE_NAME}
    SET
      task_header = '${changes.getHeader()}',
      task_desc = '${changes.getDescription()}',
      task_priority = '${changes.getPriority()}',
      performer_id = '${changes.getPerformer()}',
      task_status = '${changes.getStatus()}'
    WHERE
      link_id = '${linkId}'
    `, { type: QueryTypes.UPDATE }))[0]
  } catch (e) {
    await telegramBot.editMessage({
      msg: response,
      phrase: `${e.message}`,
      user,
      keyboard: MAIN_KEYBOARD,
      bot
    })
  }
}


export async function updateSubTaskById({ uuid, changes }) {
  try {
    return (await subTaskConn.query(`
    UPDATE
      ${process.env.DB_SUBTASK_TABLE_NAME}
    SET
      subtask_header = '${changes.getHeader()}',
      subtask_desc = '${changes.getDescription()}',
      subtask_priority = '${changes.getPriority()}',
      performer_id = '${changes.getPerformer()}',
      subtask_status = '${changes.getStatus()}'
    WHERE
      uuid = '${uuid}'
    `, { type: QueryTypes.UPDATE }))[0]
  } catch (e) {
    await telegramBot.editMessage({
      msg: response,
      phrase: `${e.message}`,
      user,
      keyboard: MAIN_KEYBOARD,
      bot
    })
  }
}


export async function getSubTaskById( linkId ) {
  try {
    return (await subTaskConn.query(`
    SELECT
      *
    FROM
      subtasks_storage
    WHERE
      link_id = '${linkId}'
    `, { type: QueryTypes.SELECT }))
  } catch (e) {
    await telegramBot.editMessage({
      msg: response,
      phrase: `${e.message}`,
      user,
      keyboard: MAIN_KEYBOARD,
      bot
    })
  }
}


export async function getSubTaskByUuid( uuid ) {
  try {
    return (await subTaskConn.query(`
    SELECT
      *
    FROM
      subtasks_storage
    WHERE
      uuid = '${uuid}'
    `, { type: QueryTypes.SELECT }))[0]
  } catch (e) {
    await telegramBot.editMessage({
      msg: response,
      phrase: `${e.message}`,
      user,
      keyboard: MAIN_KEYBOARD,
      bot
    })
  }
}

export async function delTask (deleteValue) {
  try {
    let quantitySubtask = await getSubTaskById(deleteValue)
    if (quantitySubtask) {
      await subTaskConn.query(`
      DELETE
      FROM
        subtasks_storage
      WHERE
        link_id = '${deleteValue}'
    `, { type: QueryTypes.DELETE })
    }
    await taskConn.query(`
    DELETE
    FROM
      task_storage
    WHERE
      link_id = '${deleteValue}'
  `, { type: QueryTypes.DELETE })
  } catch (e) {
    await telegramBot.editMessage({
      msg: response,
      phrase: `${e.message}`,
      user,
      keyboard: MAIN_KEYBOARD,
      bot
    })
  }
}

export async function delSubTask(deleteValue) {
  try {
    await taskConn.query(`
    DELETE
    FROM
      subtasks_storage
    WHERE
      uuid = '${deleteValue}'
  `, { type: QueryTypes.DELETE })
  } catch (e) {
    await telegramBot.editMessage({
      msg: response,
      phrase: `${e.message}`,
      user,
      keyboard: MAIN_KEYBOARD,
      bot
    })
  }
}