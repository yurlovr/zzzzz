const TelegramBot = require('node-telegram-bot-api')

const TOKEN = '1048121825:AAFth28sqZtR5E2cMLblu_bLoU7D7tMCydI'
const bornDate = new Date('05.16.2020').getTime()
const msInDay = 86400000
const msInHour = 3600000
const msInMinutes = 60000
const msInSeconds = 1000
const bot = new TelegramBot(TOKEN, {polling: true})
bot.on('message', msg => {
  bot.sendMessage(msg.chat.id, timeToBornDate(msg.text) )
})

function timeToBornDate(str) {
  if (str.toLowerCase() === 'сколько') {
    const currentDate = new Date().getTime()
    const timeBeforeBirthDay = bornDate - currentDate
    const day = (timeBeforeBirthDay -  timeBeforeBirthDay % msInDay) / msInDay
    let ostatok = timeBeforeBirthDay % msInDay
    const hours = (ostatok  - ostatok % msInHour) / msInHour
    ostatok = ostatok % msInHour
    const minutes = (ostatok  - ostatok % msInMinutes) / msInMinutes
    ostatok = ostatok % msInMinutes
    const seconds = (ostatok  - ostatok % msInSeconds) / msInSeconds
    const ms = ostatok % msInSeconds
    // const str =  `До Дня Рождения Ани осталось ${day} дня, ${hours} часов, ${minutes} минут, ${seconds} секунд, ${ms} миллисекунд! :-)`
    // console.log(`До Дня Рождения Ани осталось ${day} дня, ${hour} часов, ${minutes} минут, ${seconds} секунд, ${ms} миллисекунд! :-)`)
    return `До Дня Рождения Ани осталось ${day} дня, ${hours} часов, ${minutes} минут, ${seconds} секунд, ${ms} миллисекунд! :-)`
  }
  return 'Спросите меня лучше когда День Рождения Ани!!! Для этого отправьте мне - сколько'
}
