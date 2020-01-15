const fetch = require('node-fetch')

async function giveMePhoto() {
  const response = await fetch('https://api.thecatapi.com/v1/images/search')
  const data = await response.json()
  console.log('data', data)
  return data[0].url
}

giveMePhoto()
.then(r =>console.log(r))
