const { CONST } = require('../const/const')

module.exports.lastLetterInStr = function lastLetterInStr (str) {
  let lastLetter = str[str.length - 1]
  if (CONST.notLetter.some(i => i === lastLetter)) {
    lastLetter = str[str.length - 2]
  }
  return lastLetter
}