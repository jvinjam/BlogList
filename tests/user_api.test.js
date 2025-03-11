const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcryptjs')

beforeEach(async () => {
  await User.deleteMany({})

  const pwHash  = await bcrypt.hash('rootpw', 10)
  const user = new User({ userName: 'root', passwordHash: pwHash })
  await user.save()
})

describe('when there is initially one user in db', () => {
  test('users are returned as json', async () => {
    await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, 1)
  })

  test('root is in the returned users', async () => {
    const response = await api.get('/api/users')
    const userName = response.body.map(b => b.userName)
    assert(userName.includes('root'))
  })

  test('creation succeeds with a new username', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      userName: 'userNameTest',
      name: 'First Last',
      password: 'testPW'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    assert.strictEqual(usersAfter.length, usersBefore.length + 1)
    const usersNames = usersAfter.map(u => u.userName)
    assert(usersNames.includes(newUser.userName))
  })

  test('creation fails with proper statuscode and message if username exists in the db', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      userName: 'root',
      name: 'First Last',
      password: 'rootPW'
    }

    const result = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    assert.strictEqual(usersAfter.length, usersBefore.length)
    assert(result.body.error.includes('expected `userName` to be unique'))
  })

  test('creation fails with 400 error code and message if username is shorter than 3', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      userName: 'rt',
      name: 'First Last',
      password: 'rootPW'
    }

    const result = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    assert.strictEqual(usersAfter.length, usersBefore.length)
    assert(result.body.error.includes('`userName` (`rt`) is shorter than the minimum allowed length (3)'))
  })

  test('creation fails with 400 error code and message if password is shorter than 3', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      userName: 'testUser',
      name: 'First Last',
      password: 'pw'
    }

    const result = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    assert.strictEqual(usersAfter.length, usersBefore.length)
    assert(result.body.error.includes('password is shorter than the minimum allowed length (3)'))
  })

})

after(async () => {
  await mongoose.connection.close()
})