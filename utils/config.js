// Import environment variables from.env file
require('dotenv').config()

const PORT = process.env.PORT
// Define the connection URL to MongoDB database
const MONGODB_URI = process.env.MONGODB_URI

module.exports = { PORT, MONGODB_URI }
