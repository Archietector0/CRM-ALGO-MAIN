import { QueryTypes } from "sequelize"
import { db } from "../DataBase.js"

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


export async function getCurrentUserTasks({ projectName, seniorId }) {
  return await taskConn.query(`
  SELECT
    *
  FROM
    task_storage
  WHERE
    project_name = '${projectName}'
    and senior_id = '${seniorId}'
  `, { type: QueryTypes.SELECT })
}

export async function getTaskById( linkId ) {
  return (await taskConn.query(`
  SELECT
    *
  FROM
    task_storage
  WHERE
    link_id = '${linkId}'
  `, { type: QueryTypes.SELECT }))[0]
}

export async function updateTaskById({ linkId, changes }) {
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
}


export async function updateSubTaskById({ uuid, changes }) {
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
}


export async function getSubTaskById( linkId ) {
  return (await subTaskConn.query(`
  SELECT
    *
  FROM
    subtasks_storage
  WHERE
    link_id = '${linkId}'
  `, { type: QueryTypes.SELECT }))
}


export async function getSubTaskByUuid( uuid ) {
  return (await subTaskConn.query(`
  SELECT
    *
  FROM
    subtasks_storage
  WHERE
    uuid = '${uuid}'
  `, { type: QueryTypes.SELECT }))[0]
}