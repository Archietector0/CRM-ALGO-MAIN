import TelegramBot from 'node-telegram-bot-api';
import Koa from 'koa'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import {} from 'dotenv/config';
import { addCurrentUser, getCurrentUser } from './src/core/userSession.js';
import { processingCallbackQueryOperationLogic } from './src/core/cbQueryOperationLogic.js';
import { processingMessageOperationLogic } from './src/core/msgOperationLogic.js';
import { writeLogToDB } from './src/db/logger.js';
import { telegramBot } from './src/telegram/TelegramBot.js';
import { MAIN_KEYBOARD } from './src/telegram/constants/keyboards.js';

const users = new Map();

const URL = process.env.URL
const TOKEN = process.env.TOKEN
const PORT = process.env.PORT

const bot = new TelegramBot(TOKEN);
const app = new Koa()
const router = new Router()

bot.setWebHook(`${URL}/bot${TOKEN}`)

router.post(`/bot${TOKEN}`, async ctx => {
  const { body } = ctx.request
  console.log('Data from server: ', body);
  bot.processUpdate(body)
  ctx.status = 200
})

app.use(bodyParser())
app.use(router.routes())

app.listen(PORT, () => {
  console.log(`Listening port ${PORT}`);
})

bot.onText(/\/restart/, async (msg) => {
  addCurrentUser({ users, currentUserInfo: msg, action: 'message' })
  let user = getCurrentUser({ users, currentUserInfo: msg, action: 'message' })

  // try {
  //   await bot.deleteMessage(msg.chat.id, msg.message_id - 1)
  // } catch (e) {
  //   console.log(e.message);
  // }
  // await telegram.deleteMsg({ msg, bot })

  const phrase = `💼 <b>CRM ALGO INC.</b>\n\nХэй, <b>${user.getFirstName()}</b>, рады тебя видеть 😉\n\nДавай намутим делов 🙌`;
  await telegramBot.sendMessage({ msg, phrase, keyboard: MAIN_KEYBOARD, bot })
})


bot.on('message', async (msg) => {
  if (msg.text === '/restart') return
  if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') return
  addCurrentUser({ users, currentUserInfo: msg, action: 'message' })
  let user = getCurrentUser({ users, currentUserInfo: msg, action: 'message' })

  await writeLogToDB({ response: msg, user })


  await processingMessageOperationLogic({ response: msg, user, bot });
})

bot.on('callback_query', async (cbQuery) => {
  addCurrentUser({ users, currentUserInfo: cbQuery, action: 'callback_query', state: cbQuery.data });
  const user = getCurrentUser({ users, currentUserInfo: cbQuery, state: cbQuery.data, action: 'callback_query' });

  await writeLogToDB({ response: cbQuery, user })

  await processingCallbackQueryOperationLogic({ response: cbQuery, user, bot });
})