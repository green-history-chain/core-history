'use strict'

//  import web3 from 'lib/web3'
const TelegramBot = require('node-telegram-bot-api')
const http = ('http')
const BlockCreator = ('child-chain/blockCreator')
const Routing = ('routing')
const logger = ('lib/logger')
const dpt = ('lib/p2p')
const config = ('config')


const token = process.env.TELEGRAM_TOKEN || '715239380:AAG6KnKR5JmOJfh9QwShtaFuof9px2XEEls'
const port = process.env.PORT || 30313;
const bot = new TelegramBot(token, {
  polling: true
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
// Listen for any kind of message. There are different kinds of
// messages.
function startTelegram() {
  bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
  })
  bot.on('message', (msg) => {
    if (msg.photo) {
      console.log('msg :', msg);
      console.log('file_id :', msg.photo[0].file_id);
      const raw = msg.photo[0].file_id
      const path = raw + ".jpg"
      const file_info = bot.get_file(raw)
      const downloaded_file = bot.download_file(file_info.file_path)
      console.log('downloaded_file :', downloaded_file);       
    }

    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
  })
}

(async () => {
  try {
    if (!config.bootNode) {
      await sleep(5000)
    }
    // await web3.eth.net.isListening()
    startTelegram()
    BlockCreator.start()

    http.createServer(Routing.route).listen(port, (err) => {
      if (err) {
        return
      }
      logger.info('HTTP started at: http://127.0.0.1:' + port)
    })

    dpt.on('error', (err) => logger.error(err))


  } catch (e) {
    logger.error('Web3 instance is not available' + e)
    logger.info('BYE')
    // process.exit()
  }
})()
