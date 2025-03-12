// Import environment variables from.env file
require('dotenv').config()

const PORT = process.env.PORT
// Define the connection URL to MongoDB database
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const SECRET = process.env.SECRET

module.exports = { PORT, MONGODB_URI, SECRET }
