const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const some = require('./libs/some')
const { CITIES } = require('./const/russian_cites')
const { CONST } = require('./const/const')
const { Shuffle } = require('./libs/shuffle')
const { lastLetterInStr } = require('./libs/lastLetter')
const { RandomInteger } = require('./libs/randomInteger')

let users = []
let citiesForGame = CITIES

const bot = new TelegramBot(CONST.token, {
  polling: true,
  })
bot.on('message', msg => {
  const chatId = msg.chat.id
  const firstName = msg.from.first_name
  // console.log(msg)
  if (!findCurrentUser(users, chatId)) {
    users = addUser(users, chatId, firstName, msg.date)
  }

  let currentUser = findCurrentUser(users, chatId)

  if (currentUser.gameCities) {
    switch (msg.text.toLowerCase()) {
      case CONST.phrase.stop:
      users = isBeginGame(users, currentUser, false)  
      bot.sendMessage(chatId, CONST.phrase.endGame)  
        break
      case CONST.phrase.question:
        const currentCity = currentUser.city[currentUser.city.length - 1]

        bot.sendMessage(chatId, `Город ${currentCity.name}\r\nнаходится в Федеральном округе: ${currentCity.district}\r\nв Регионе:  ${currentCity.subject}\r\nс населением - ${currentCity.population} человек`)
        break
       case CONST.phrase.city:
        bot.sendMessage(chatId, CONST.phrase.gameIsAlredyBegin)  
        break
      default:
        const data = gameInCities(users, currentUser, citiesForGame, msg.text)
      
        if (data.users) {
          users = data.users
          currentUser = data.currentUser
        }
        bot.sendMessage(chatId, data.message)
        break
      }
    return
  }

  switch (msg.text.toLowerCase()) {

    case CONST.phrase.city:
      users = isBeginGame(users, currentUser, true)

      citiesForGame = Shuffle(citiesForGame)
      bot.sendMessage(chatId, CONST.phrase.gameBegin)  
      break

    case  CONST.phrase.cat: 
      giveMePhotoCat()
        .then(photo => {
          bot.sendPhoto(chatId, photo, { caption: '' });
        })
        .catch(() => {
          bot.sendMessage(chatId, CONST.phrase.notAvailable)
        })
      break

    case CONST.phrase.dog:
      giveMePhotoDog()
        .then(photo => {
          bot.sendPhoto(chatId, photo, { caption: '' });
        })
        .catch(() => {
          bot.sendMessage(chatId, CONST.phrase.notAvailable)
        })
      break

    case CONST.phrase.fox:
      giveMePhotoFox()
        .then(photo => {
          bot.sendPhoto(chatId, photo, { caption: '' })
        })
        .catch(() => {
          bot.sendMessage(chatId, CONST.phrase.notAvailable)
        })
      break

      case CONST.phrase.usd:
        giveMeValute(CONST.valute.usd)
          .then(val => {
            bot.sendMessage(chatId, `Курс ${CONST.phrase.usd + 'а'} - ${val.toFixed(2)} ₽.`)
          })
          .catch(() => {
            bot.sendMessage(chatId, CONST.phrase.notAvailable)
          })
        break

      case CONST.phrase.eur:
        giveMeValute(CONST.valute.eur)
          .then(val => {
            bot.sendMessage(chatId, `Курс ${CONST.phrase.eur} - ${val.toFixed(2)} ₽.`)
          })
          .catch(() => {
            bot.sendMessage(chatId, CONST.phrase.notAvailable)
          })
        break

    case CONST.phrase.hello:
      const message = CONST.phrase.hello[0].toLocaleUpperCase() + CONST.phrase.hello.slice(1)  + ', ' + firstName +'! ' + CONST.phrase.how
        bot.sendMessage(chatId, message) 
        break
    default: 
      bot.sendMessage(chatId,  timeToBornDate(msg.text))  
      break
  }
})

function gameInCities(users, currentUser, cities, str) {
  if(currentUser.city.length && currentUser.firstLetter !== str.toLowerCase().charAt(0)) {
    return { message: CONST.phrase.letterCity + currentUser.firstLetter.toLocaleUpperCase() }
  }
  const userCity = cities.find(city => city.name.toLowerCase() === str.toLowerCase())
  if (!userCity) {
    return { message: CONST.phrase.isNotCity }
  } else {

    const alredyExist = cityAllredyExist(currentUser, str)
    if (alredyExist) return { message: CONST.phrase.alreadyExist }

    currentUser.city = currentUser.city.concat(userCity)

    users = users.map(user => {
      if (user.id === currentUser.id) {
        return { ...user, city: currentUser.city}
      }
      return user
    })

    const lastLetter = lastLetterInStr(str)

    const availabelCity = cities.filter(city => city.name.toLowerCase().charAt(0) === lastLetter && !currentUser.city.find(i => i.name.toLowerCase() === city.name.toLowerCase()))

    const city = availabelCity[RandomInteger(0, availabelCity.length)]
    
    currentUser.city = currentUser.city.concat(city)
    currentUser.firstLetter = lastLetterInStr(city.name)
    
    users = users.map(user => {
      if (user.id === currentUser.id) {
        return { ...user, city: currentUser.city, firstLetter: currentUser.firstLetter }
      }
      return user
    }) 
    console.log(city.name)
    return { users, currentUser, message: city.name }
  }
}

function cityAllredyExist (currentUser, str) {
  return currentUser.city.some(city => city.name.toLowerCase() === str.toLowerCase())
}

function findCurrentUser (users, id) {
  return users.find(user => user.id === id)
}

function isBeginGame (users, currentUser, isGame) {
  return users.map(user => {
    if (user.id === currentUser.id) {
      if (!isGame) {
        user.city = []
        user.firstLetter = ''
      }
      user.gameCities = isGame
    }
    return user
  })
}

function addUser (users, id, name, date) {
  return users.concat({
          id,
          name,
          gameCities: false,
          date,
          city: [],
          firstLetter: ''
        })
}

async function giveMePhotoCat() {
  const response = await fetch('https://api.thecatapi.com/v1/images/search')
  const data = await response.json()
  return data[0].url
}

async function giveMeValute(val) {
  const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
  const data = await response.json()
  if (val === CONST.valute.usd) {
    return data.Valute.USD.Value
  }
  if (val === CONST.valute.eur) {
    return data.Valute.EUR.Value
  }
}

async function giveMePhotoFox() {
  const response = await fetch('https://randomfox.ca/floof/')
  const data = await response.json()
  return data.image
}

async function giveMePhotoDog() {
  const response = await fetch('https://dog.ceo/api/breeds/image/random')
  const data = await response.json()
  if (data.status === 'success') {
    return data.message
  } else {
    return CONST.phrase.notAvailable
  }
}

function timeToBornDate(str) {
  if(str.toLowerCase() === CONST.phrase.MISHA || str.toLowerCase() === CONST.phrase.ANYA) {
    let name = ''
    let time = {}
    if (str.toLowerCase() === CONST.phrase.MISHA) {
      name= CONST.phrase.MISHA_R
      time = timeToEvent(CONST.date.MISHA)
    }
    if (str.toLowerCase() === CONST.phrase.ANYA) {
      name= CONST.phrase.ANYA_R
      time = timeToEvent(CONST.date.ANYA)
    }
    return `До Дня Рождения ${name} осталось ${time.day} дня, ${time.hours} часов, ${time.minutes} минут, ${time.seconds} секунд, ${time.ms} миллисекунд! :-)`
  }
  if (some(str.toLowerCase(), CONST.phrase.summer)) {
    time = timeToEvent(CONST.date.SUMMER)
    return ` До летних каникул осталось ${time.day} дня, ${time.hours} часов, ${time.minutes} минут, ${time.seconds} секунд, ${time.ms} миллисекунд!`
  }
  if (some(str.toLowerCase(), CONST.phrase.newYear)) {
    time = timeToEvent(CONST.date.NEWYEAR)
    return ` До Нового 2021 года осталось ${time.day} дня, ${time.hours} часов, ${time.minutes} минут, ${time.seconds} секунд, ${time.ms} миллисекунд!`
  }
  return  CONST.phrase.default
}

function timeToEvent(date) {
  const currentDate = new Date().getTime()
  const timeBeforeBirthDay = date - currentDate
  const day = (timeBeforeBirthDay -  timeBeforeBirthDay % CONST.time.msInDay) / CONST.time.msInDay
  let ostatok = timeBeforeBirthDay % CONST.time.msInDay
  const hours = (ostatok  - ostatok % CONST.time.msInHour) / CONST.time.msInHour
  ostatok = ostatok % CONST.time.msInHour
  const minutes = (ostatok  - ostatok % CONST.time.msInMinutes) / CONST.time.msInMinutes
  ostatok = ostatok % CONST.time.msInMinutes
  const seconds = (ostatok  - ostatok % CONST.time.msInSeconds) / CONST.time.msInSeconds
  const ms = ostatok % CONST.time.msInSeconds
  return { day, hours, minutes, seconds, ms }
}
