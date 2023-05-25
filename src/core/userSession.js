import { SubTask } from "../telegram/SubTask.js";
import { Task } from "../telegram/Task.js";
import { User } from "../telegram/User.js";

export function addCurrentUser({ users, currentUserInfo, action, state = 'START' }) {
  let flag = 0;
  let firstName;
  let userName;
  let userId;
  let mainMsgId;

  for (let key in currentUserInfo) {
    if (key === 'message') {
      flag = 1;
    } 
  } 
  userId = !flag ? currentUserInfo.chat.id : currentUserInfo.message.chat.id;
  firstName = !flag
    ? currentUserInfo.chat.first_name
    : currentUserInfo.message.chat.first_name;
  userName = !flag
    ? currentUserInfo.chat.username
    : currentUserInfo.message.chat.username;
  mainMsgId = !flag ? currentUserInfo.message_id : currentUserInfo.message.message_id;

  if (!users.has(userId)) {
    let task = new Task()
    task.setSenior(userId)
    users.set(
      userId,
      new User({
        firstName,
        userId,
        userName: `${userName ? '@' + userName : 'NOT_SPECIFIED'}`,
        action,
        mainMsgId: mainMsgId + 1,
        state,
        subTask: new SubTask(),
        task
      })
    );
  }
}

export function getCurrentUser({ users, currentUserInfo, state = 'DEFAULLT', action }) {
  let flag = 0;

  for (let key in currentUserInfo)
    if (key === 'message')
      flag = 1;

  if (flag) {
    let user = users.get(currentUserInfo.message.chat.id)
    user.getTask().setSenior(currentUserInfo.message.chat.id)
    user.setState(state)
    user.setAction(action)
    return user
  } else {
    let user = users.get(currentUserInfo.chat.id)
    user.getTask().setSenior(currentUserInfo.chat.id)
    user.setAction(action)
    return user
  }
}