import TelegramBot from 'node-telegram-bot-api';
import Koa from 'koa'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import {} from 'dotenv/config';
import { addCurrentUser, getCurrentUser } from './src/core/userSession.js';
import { processingCallbackQueryOperationLogic } from './src/core/cbQueryOperationLogic.js';
import { processingMessageOperationLogic } from './src/core/msgOperationLogic.js';

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
  // console.log('Data from server: ', body);
  bot.processUpdate(body)
  ctx.status = 200
})

app.use(bodyParser())
app.use(router.routes())

app.listen(PORT, () => {
  console.log(`Listening port ${PORT}`);
})


bot.on('message', async (msg) => {
  // if (msg.text === '/start') return
  if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') return
  addCurrentUser({ users, currentUserInfo: msg, action: 'message' })
  let user = getCurrentUser({ users, currentUserInfo: msg })

  // await writeLogToDB({ msg, userSession: user })


  await processingMessageOperationLogic({ response: msg, user, bot });
})

bot.on('callback_query', async (cbQuery) => {
  addCurrentUser({ users, currentUserInfo: cbQuery, action: 'callback_query', state: cbQuery.data });
  const user = getCurrentUser({ users, currentUserInfo: cbQuery, state: cbQuery.data });

  // await writeLogToDB({ msg: cbQuery, userSession: user })

  await processingCallbackQueryOperationLogic({ response: cbQuery, user, bot });
})