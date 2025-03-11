const express = require('express')
//To eleminate try-catch blocks and use errorHandler, npm install express-async-errors and import 'express-async-errors'
require('express-async-errors')
const app = express()
const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

// Import required modules
const mongoose = require('mongoose')
// Connect to MongoDB using environment variables
mongoose.set('strictQuery', false)

// Define the connection URL to MongoDB database
logger.info('connecting to', config.MONGODB_URI)

// Connect to MongoDB
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB: ', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
// Middleware for logging HTTP requests
app.use(
  middleware.morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.use(middleware.tokenExtractor)

app.get('/api/blogs', blogsRouter)
app.get('/api/blogs/:id', blogsRouter)

app.post('/api/blogs', middleware.userExtractor, blogsRouter)
app.delete('/api/blogs/:id', middleware.userExtractor, blogsRouter)
app.put('/api/blogs/:id', middleware.userExtractor, blogsRouter)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app