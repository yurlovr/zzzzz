const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
// bot.sendPhoto(chatId, photo, { caption: 'Милые котята' });
const TOKEN = '1048121825:AAFth28sqZtR5E2cMLblu_bLoU7D7tMCydI'
const bornDate =  {
  ANYA: new Date('05.16.2020').getTime(),
  MISHA: new Date('10.10.2020').getTime(),
}
const msInDay = 86400000
const msInHour = 3600000
const msInMinutes = 60000
const msInSeconds = 1000
const bot = new TelegramBot(TOKEN, {
  polling: true,
  })
bot.on('message', msg => {
  if (msg.text.toLowerCase() !== 'cat') {
    bot.sendMessage(msg.chat.id, timeToBornDate(msg.text) )
  } else {
    giveMePhoto()
      .then(photo => {
        bot.sendPhoto(chatId, photo, { caption: '' });
      })
  }
})

async function giveMePhoto() {
  const response = await fetch('https://api.thecatapi.com/v1/images/search')
  const data = await response.json()
  return data[0].url
}

function timeToBornDate(str) {
  if(str.toLowerCase() === 'миша' || str.toLowerCase() === 'аня') {
    let date = null
    let name = ''
    if (str.toLowerCase() === 'миша') {
      date = bornDate.MISHA
      name= 'Миши'
    }
    if (str.toLowerCase() === 'аня') {
      date = bornDate.ANYA
      name= 'Ани'
    }
    const currentDate = new Date().getTime()
    const timeBeforeBirthDay = date - currentDate
    const day = (timeBeforeBirthDay -  timeBeforeBirthDay % msInDay) / msInDay
    let ostatok = timeBeforeBirthDay % msInDay
    const hours = (ostatok  - ostatok % msInHour) / msInHour
    ostatok = ostatok % msInHour
    const minutes = (ostatok  - ostatok % msInMinutes) / msInMinutes
    ostatok = ostatok % msInMinutes
    const seconds = (ostatok  - ostatok % msInSeconds) / msInSeconds
    const ms = ostatok % msInSeconds
    return `До Дня Рождения ${name} осталось ${day} дня, ${hours} часов, ${minutes} минут, ${seconds} секунд, ${ms} миллисекунд! :-)`
    }
  return 'Спросите меня лучше когда День Рождения Миши или Ани!!! Для этого отправьте мне - Миша или Аня'
}
