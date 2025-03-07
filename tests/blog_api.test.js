const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const { ObjectId } = require('mongoose').Types
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  // const blogObjs = helper.initialBlogs.map(blog => new Blog(blog))
  // const promiseArray = blogObjs.map(blog => blog.save())
  // await Promise.all(promiseArray)
})

describe('When there are some Blogs initially', () => {
  test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('Blog 1 is in the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const blogTitles = response.body.map(b => b.title)
    assert(blogTitles.includes('Blog 1'))
  })
})

describe('Viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsInDb = await helper.blogsInDb()
    const blogToView = blogsInDb[0]
    const result = await api.get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.deepStrictEqual(result.body, blogToView)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()
    await api.get(`/api/blogs/${validNonExistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '111'
    await api.get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('Adding a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      'title': 'Blog 3',
      'author': 'Author 3',
      'url': 'www.link3.com',
      'likes': 4
    }
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsInDb = await helper.blogsInDb()
    assert.strictEqual(blogsInDb.length, helper.initialBlogs.length + 1)
    const titles = blogsInDb.map(b => b.title)
    assert(titles.includes('Blog 3'))
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      'author': 'Author 4',
      'url': 'www.link4.com',
      'likes': 4
    }
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsInDb = await helper.blogsInDb()
    assert.strictEqual(blogsInDb.length, helper.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      'title': 'Blog 4',
      'author': 'Author 4',
      'likes': 4
    }
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsInDb = await helper.blogsInDb()
    assert.strictEqual(blogsInDb.length, helper.initialBlogs.length)
  })
})

describe('Deleting a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToDelete = blogsBefore[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length - 1)
    const titles = blogsAfter.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('fails with status code 404 if id does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()
    await api.delete(`/api/blogs/${validNonExistingId}`)
      .expect(404)

    const blogsInDb = await helper.blogsInDb()
    assert.strictEqual(blogsInDb.length, helper.initialBlogs.length)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '111'
    await api.delete(`/api/blogs/${invalidId}`)
      .expect(400)

    const blogsInDb = await helper.blogsInDb()
    assert.strictEqual(blogsInDb.length, helper.initialBlogs.length)
  })
})

describe('Updating a blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToUpdate = blogsBefore[0]
    const newBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

    const response = await api.put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)
    const updatedBlog = response.body

    const blogsAfter = await helper.blogsInDb()
    const updatedBlogInDb = blogsAfter.find(b => b.id === updatedBlog.id)
    assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 1)
  })

  test('fails with status code 404 if id does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()
    const newBlog = {
      'title': 'Blog 3',
      'author': 'Author 3',
      'url': 'www.link3.com',
      'likes': 4
    }
    await api.put(`/api/blogs/${validNonExistingId}`)
      .send(newBlog)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '111'
    const newBlog = {
      'title': 'Blog 3',
      'author': 'Author 3',
      'url': 'www.link3.com',
      'likes': 4
    }
    await api.put(`/api/blogs/${invalidId}`)
      .send(newBlog)
      .expect(400)
  })
})

test('unique identifier is named - id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body  //.map(b => b.id)
  const blogsMatchingId = await Blog.find({ _id: new ObjectId(blogs[0].id) })
  assert.strictEqual(blogsMatchingId.length, 1)
  assert(blogs[0].id !== undefined)
  assert(blogs[0]._id === undefined)
})

test('default likes is 0', async () => {
  const newBlog = {
    'title': 'Blog 4',
    'author': 'Author 4',
    'url': 'www.link4.com'
  }
  const response = await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

after(async () => {
  await mongoose.connection.close()
})
