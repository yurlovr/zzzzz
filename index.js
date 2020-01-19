const TelegramBot = require('node-telegram-bot-api')

const TOKEN = 
const bot = new TelegramBot(TOKEN, {polling: true})
bot.on('message', msg => {
  let result = null
  if(msg.text) {
    result = begin(msg.text) + ''
  } else {
    result = 'пустота'
  }
  bot.sendMessage(msg.chat.id, result)
})

function twoPart (str) {
  let result = {}
  const arr = str.replace(/\+/g,' + ').replace(/\*/g, ' * ').replace(/\-/g,' - ').replace(/\=/g, ' =').split('=')
  result.left = arr[0]
  result.right = arr[1]
  return result
}

function s(str) {
  let arr = str.split(' ').filter(i => i)
  let x = 0
  let num = 0
  let flag = null
  let beforeFlag = null
  arr = arr.map((i, index) => {
    
    if (i === ')') {
      flag = false
      return null
    }
    if (i === '(') {
      flag = true
      beforeFlag = arr[index - 1]
      return null
    }
    if (flag) {
      if (beforeFlag === '-') {
        if(!parseInt(i) && i === 'x'){
          return i
        }
        if(!parseInt(i) && i === '+'){
          return '-'
        }
        if(!parseInt(i) && i === '-'){
          return '+'
        }
      }
      if (beforeFlag === '+') {
        return i
      }
    }
    return i
  }).filter(i => i)
  arr.forEach((i,index) => {
    if (i === 'x') {
      if (index === 0) {
        x +=1
      }
      if (arr[index - 1] === '+') {
        x +=1
      }
      if(arr[index - 1] === '-' && arr[index + 1] !== '*') {
        x -=1
      }
      if (arr[index - 1] === '*') {
        if (arr[index - 3] === '+' || arr[index - 3] === undefined) {
          x = x + +arr[index - 2]
        }
        if (arr[index - 3] === '-') {
          x = x - +arr[index - 2]
        }
      }
      if (arr[index + 1] === '*') {
        if (arr[index - 1] === '-') {
          x = x - +arr[index + 2]
        }
        if (arr[index - 1] === '+') {
          x = x + +arr[index + 2]
        }
      }
    }
    if(parseInt(i)) {
      if (index === 0 && arr[index + 1] !== '*') {
        num += +i
      }
      if (arr[index - 1] === '+' && (arr[index + 1] !== '*' )) { //&& arr[index + 2] !== 'x'
        num += +i
      }
      if (arr[index - 1] === '-' && (arr[index + 1] !== '*' )) { //&& arr[index + 2] !== 'x'
        num -= +i
        console.log(num)
      }
    }
  })
 return { x, num }
}

function begin(str) {
  const array = twoPart(str)  
  let object = {
    left: {
      x: s(array.left).x,
      num: s(array.left).num
    },
    right: {
      x: s(array.right).x,
      num: s(array.right).num
    }
  }
  return decision(object)
}

function decision(object) {
  let numRight = null
  let x = null
  if (!object.right.x && object.right.num) {
      numRight = object.right.num
    if (object.left.num && object.left.num > 0) {
      numRight = object.right.num - object.left.num
    }
    if (object.left.num && object.left.num < 0) {
      numRight = object.right.num + (-1 * object.left.num)
    }
    if (object.left.x) { // && object.left.x > 0
      x = numRight / object.left.x
    }
    // if (object.left.x && object.left.x < 0) {
    //   x = numRight / object.left.x
    // }
  }

  if (object.right.x && !object.right.num) {
    if (object.left.num) {
      numRight = -1 * object.left.num
    }
    x = numRight / (object.left.x + (-1 * object.right.x))
  }
  if (object.right.x && object.right.num) {
    if (object.left.num) {
      numRight = object.right.num + (-1 * object.left.num)
    }
    x = numRight / (object.left.x + (-1 * object.right.x))
  }
  return x
}