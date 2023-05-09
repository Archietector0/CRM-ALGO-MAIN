import { Task } from "../telegram/Task.js";
import { User } from "../telegram/User.js";

export function addCurrentUser({ users, currentUserInfo }) {
  let flag = 0;
  let firstName;
  let userName;
  let userId;
  let mainMsgId;

  for (let key in currentUserInfo) if (key === 'message') flag = 1;
  userId = !flag ? currentUserInfo.chat.id : currentUserInfo.message.chat.id;
  firstName = !flag
    ? currentUserInfo.chat.first_name
    : currentUserInfo.message.chat.first_name;
  userName = !flag
    ? currentUserInfo.chat.username
    : currentUserInfo.message.chat.username;
  mainMsgId = !flag ? currentUserInfo.message_id : currentUserInfo.message.message_id;

  if (!users.has(userId)) {
    users.set(
      userId,
      new User({
        userId,
        firstName,
        userName: `${userName ? '@' + userName : 'NOT_SPECIFIED'}`,
        mainMsgId: mainMsgId + 1,
        tasks: [new Task(userId)],
      })
    );
  }
}

export function getCurrentUser({ users, currentUserInfo }) {
  let flag = 0;
  let userId;

  for (let key in currentUserInfo) if (key === 'message') flag = 1;
  userId = !flag ? currentUserInfo.chat.id : currentUserInfo.message.chat.id;

  return users.get(userId);
}