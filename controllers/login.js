const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { userName, password } = request.body

  const user = await User.findOne({ userName })
  const isPwdCorrect = (user !== null) && await bcrypt.compare(password, user.passwordHash)

  if (!user || !isPwdCorrect) {
    return response.status(401)
      .json({ error: 'invalid username or password' })
  }

  const userForToken = {
    userName: user.userName,
    id: user._id
  }

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60*60 })

  return response.status(200)
    .send({ token, userName: user.userName, name: user.name, id: user.id })
})

module.exports = loginRouter