import crypto from "crypto";
import { logImg } from "./constants/constants.js";



export async function writeLogToDB ({ response, user, error = '' }) {

  const log = {
    uuid: '',
    user_name: '',
    first_name: '',
    telegram_id: '',
    date: '',
    action: '',
    state: '',
    msg_text: '',
    json_data: '',
    user_session: ''
  }

  log.uuid = crypto.randomUUID()

  if (!error) {
    log.user_name = user.getUserName() ? user.getUserName() : 'NOT_SPECIFIED'
    log.first_name = user.getFirstName() ? user.getFirstName() : 'NOT_SPECIFIED'
    log.telegram_id = user.getUserId() ? user.getUserId() : 'NOT_SPECIFIED'
    log.date = new Date()
    log.action = user.getAction() ? user.getAction() : 'NOT_SPECIFIED'
    log.state = user.getState() ? user.getState() : 'NOT_SPECIFIED'
    log.msg_text = response.text ? response.text : 'NOT_SPECIFIED',
    log.json_data = JSON.stringify(response),
    log.user_session = JSON.stringify({
      firstName: user.getFirstName() ? user.getFirstName() : 'NOT_SPECIFIED',
      userName: user.getUserName() ? user.getUserName() : 'NOT_SPECIFIED',
      userId: user.getUserId() ? user.getUserId() : 'NOT_SPECIFIED',
      action: user.getAction() ? user.getAction() : 'NOT_SPECIFIED',
      mainMsgId: user.getMainMsgId() ? user.getMainMsgId() : 'NOT_SPECIFIED',
      state: user.getState() ? user.getState() : 'NOT_SPECIFIED',
      subTask: user.getSubTask() ? user.getSubTask() : 'NOT_SPECIFIED',
      task: user.getTask() ? user.getTask() : 'NOT_SPECIFIED',
    })

    return await logImg.create(log)
  } 
  
  // else if (user.getAction() === 'callback_query' && !error) {
  //   console.log('HELLO MTH');
  //   log.header = userSession.getLastTask().getHeader() ? userSession.getLastTask().getHeader() : 'not specified'
  //   log.project_name = userSession.getLastTask().getProject() ? userSession.getLastTask().getProject() : 'not specified'
  //   log.assignee = userSession.getLastTask().getAssignFrom() ? userSession.getLastTask().getAssignFrom() : 'not specified'
  //   log.assignee_to = userSession.getLastTask().getAssignPerformer() ? userSession.getLastTask().getAssignPerformer() : 'not specified'
  //   log.priority = userSession.getLastTask().getPriority() ? userSession.getLastTask().getPriority() : 'not specified'
  //   log.description = userSession.getLastTask().getDescription() ? userSession.getLastTask().getDescription() : 'not specified'
  //   log.created_at = new Date()
  //   log.status = 'ACTIVE'

  //   return await db.image.create(log)
  // } 

  // LOGIN WITH ERRORS

  else {

    log.user_name = user.getUserName() ? user.getUserName() : 'NOT_SPECIFIED'
    log.first_name = user.getFirstName() ? user.getFirstName() : 'NOT_SPECIFIED'
    log.telegram_id = user.getUserId() ? user.getUserId() : 'NOT_SPECIFIED'
    log.date = new Date()
    log.action = user.getAction() ? user.getAction() : 'NOT_SPECIFIED'
    log.state = user.getState() ? `ERROR ${user.getState()}` : 'NOT_SPECIFIED'
    log.msg_text = error.message,
    log.json_data = JSON.stringify(response),
    log.user_session = JSON.stringify({
      firstName: user.getFirstName() ? user.getFirstName() : 'NOT_SPECIFIED',
      userName: user.getUserName() ? user.getUserName() : 'NOT_SPECIFIED',
      userId: user.getUserId() ? user.getUserId() : 'NOT_SPECIFIED',
      action: user.getAction() ? user.getAction() : 'NOT_SPECIFIED',
      mainMsgId: user.getMainMsgId() ? user.getMainMsgId() : 'NOT_SPECIFIED',
      state: user.getState() ? user.getState() : 'NOT_SPECIFIED',
      subTask: user.getSubTask() ? user.getSubTask() : 'NOT_SPECIFIED',
      task: user.getTask() ? user.getTask() : 'NOT_SPECIFIED',
    })

    return await logImg.create(log)

    
    // let msg_bf = userSession.action === 'message' ? msg : msg.message

    // log.user_name = msg_bf?.chat?.username ? `@${msg_bf?.chat?.username}` : 'not specified'
    // log.telegram_id = `${msg_bf?.chat?.id}`
    // log.date = (new Date((!msg_bf?.date ? 1 : msg_bf?.date) * 1000)).toISOString()
    // log.action = userSession.action
    // log.first_name = !msg_bf?.chat?.first_name ? 'Не указано имя' : msg_bf?.chat?.first_name
    // log.state = `${userSession.state} ERROR`
    // log.msg_text = error.message
    // log.json_data = !JSON.stringify(msg_bf) ? String({ error: 'empty JSON' }) : JSON.stringify(msg_bf)
    // log.user_session = !JSON.stringify(userSession) ? String({ error: 'empty JSON' }) : JSON.stringify(userSession)

    // return await Image.create(log)
  }



}