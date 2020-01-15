const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const some = require('./libs/some')
// bot.sendPhoto(chatId, photo, { caption: 'Милые котята' });
const TOKEN = '1048121825:AAFth28sqZtR5E2cMLblu_bLoU7D7tMCydI'
const bornDate =  {
  ANYA: new Date('05.16.2020').getTime(),
  MISHA: new Date('10.10.2020').getTime(),
  SUMMER: new Date('06.01.2020').getTime(),
  NEWYEAR: new Date('01.01.2021').getTime()
}
const newYear = ['новый год', 'нг', '2021']
const summer = ['лето', 'каникулы']
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
    let time = {}
    if (str.toLowerCase() === 'миша') {
      date = bornDate.MISHA
      name= 'Миши'
      time = timeToEvent(date)
    }
    if (str.toLowerCase() === 'аня') {
      date = bornDate.ANYA
      name= 'Ани'
      time = timeToEvent(date)
    }
    return `До Дня Рождения ${name} осталось ${time.day} дня, ${time.hours} часов, ${time.minutes} минут, ${time.seconds} секунд, ${time.ms} миллисекунд! :-)`
  }
  if (some(str.toLowerCase(), summer)) {
    date = bornDate.SUMMER
    time = timeToEvent(date)
    return ` До летних каникул осталось ${time.day} дня, ${time.hours} часов, ${time.minutes} минут, ${time.seconds} секунд, ${time.ms} миллисекунд!`
  }
  if (some(str.toLowerCase(), newYear)) {
    date = bornDate.SUMMER
    time = timeToEvent(date)
    return ` До летних каникул осталось ${time.day} дня, ${time.hours} часов, ${time.minutes} минут, ${time.seconds} секунд, ${time.ms} миллисекунд!`
  }
  return 'Спросите меня лучше когда День Рождения Миши или Ани!!! Для этого отправьте мне - Миша или Аня'
}

function timeToEvent(date) {
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
  return { day, hours, minutes, seconds, ms }
}
