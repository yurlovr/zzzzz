const helloFunc = function helloFunc(str, array) {
  let arr = str.split(' ')
  return arr.some(i => array.some(item => item === i))
}

module.exports = helloFunc