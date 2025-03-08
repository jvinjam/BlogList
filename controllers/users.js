const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

// GET all users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

//POST a new user
usersRouter.post('/', async (request, response) => {
  const { userName, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({ userName, name, passwordHash })
  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter