const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')

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

app.use('/api/blogs', blogsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app