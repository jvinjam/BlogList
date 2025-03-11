const logger = require('./logger')
const config = require('./config')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const morgan = require('morgan')

// Middleware for parsing JSON request bodies
morgan.token('body', function (req) {
  if ('POST'.includes(req.method))
    return JSON.stringify(req.body)
  else
    return ''
})

//extract the token from request
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

//extract the user holding the token
const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'Token missing' })
  }

  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  if (user) {
    request.user = user
  }
  next()
}


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
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

module.exports = { morgan, tokenExtractor, userExtractor, unknownEndpoint, errorHandler }