const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')

const TOKEN = 
const hello = ['хорошо', 'отлично', 'норм','ок', 'нормально']
const bot = new TelegramBot(TOKEN, {polling: true})
bot.on('message', msg => {
  let res = reverse(msg.text)
  bot.sendMessage(msg.chat.id, res )
})

function reverse(str) {
  if(str.toLowerCase().includes('привет')){
    return 'Привет, как твои дела?'
  }
  if(helloFunc(str.toLowerCase(), hello)) {
    return 'это Отлично!!!'
  }
  
  return str.split('').reverse().join('')
}

function helloFunc(str, array) {
  let arr = str.split(' ')
  return arr.some(i => array.some(item => item === i))
}
