const logger = require('./logger')

const morgan = require('morgan')
// Middleware for parsing JSON request bodies
morgan.token('body', function (req) {
  if ('POST'.includes(req.method))
    return JSON.stringify(req.body)
  else
    return ''
})

// Handle errors for all routes that are not defined
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Middleware for error handling
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `userName` to be unique' })
  }

  next(error)
}

module.exports = { morgan, unknownEndpoint, errorHandler  }