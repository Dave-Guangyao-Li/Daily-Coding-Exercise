// Server

function getRandomString({ length }) {
  const characterChoices =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 '
  const characters = []
  while (characters.length < length) {
    const randomIndex = Math.floor(Math.random() * characterChoices.length)
    characters.push(characterChoices[randomIndex])
  }
  return characters.join('')
}

function getRandomInteger({ min, max }) {
  return Math.floor((Math.random() + min) * (max - min))
}

function generateSuggestion(prefix) {
  const RATIO_EXACT_MATCH = 0.3
  const RATIO_AUTOCORRECT = 0.1

  if (Math.random() < RATIO_AUTOCORRECT) {
    return getRandomString({
      length: getRandomInteger({ min: 1, max: prefix.length }),
    })
  }

  if (Math.random() < RATIO_EXACT_MATCH) {
    return prefix
  }

  return (
    prefix + getRandomString({ length: getRandomInteger({ min: 1, max: 10 }) })
  )
}

function getAutocompleteHandler(data) {
  const MAX_CHARS = 10
  const NUM_AUTOCOMPLETE_RESULTS = 10
  const RATIO_AUXILLERY_DATA = 0.1

  if (data.length > MAX_CHARS) {
    return []
  }

  const results = []
  while (results.length < NUM_AUTOCOMPLETE_RESULTS) {
    const suggestion = generateSuggestion(data)
    if (results.find((result) => result.suggestion === suggestion)) {
      continue
    }

    if (Math.random() < RATIO_AUXILLERY_DATA) {
      for (let i = 0; i < 2; i++) {
        results.push({
          suggestion,
          auxillery: getRandomString({
            length: getRandomInteger({ min: 5, max: 10 }),
          }),
        })
      }
    } else {
      results.push({ suggestion, auxillery: '' })
    }
  }
  return results
}

const endpoints = {
  '/': {
    get: () => 'hello world',
  },
  '/autocomplete': {
    get: getAutocompleteHandler,
  },
}

// API library

function getFunction(url, data, callback) {
  const domain = url.substring(0, url.indexOf('/'))
  const endpoint = url.substring(url.indexOf('/'), url.length)

  callback(endpoints[endpoint]['get'](data))
}

const api = {
  get: getFunction,
}

class Database {
  constructor() {
    this.tweets = []
  }

  query({ lastTweetId, pageSize }) {
    // TODO
  }

  insert(tweet) {
    // TODO
  }
}

const database = new Database()

function getTweetsHandler(data) {
  const pageSize = data.pageSize
  const sortOrder = data.sortOrder
  const lastTweetId = data.lastTweetId

  if (sortOrder !== 'recent') {
    throw new Error('I dont know how to handle that')
  }

  return database.query({ lastTweetId, pageSize })
}

function postTweetHandler(data) {
  database.insert(data.tweet)
}

const endpoints = {
  '/tweets': {
    get: getTweetsHandler,
    post: postTweetHandler,
  },
}
