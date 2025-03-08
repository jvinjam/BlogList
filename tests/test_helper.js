const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    'title': 'Blog 1',
    'author': 'Author 1',
    'url': 'www.link1.abc',
    'likes': 2
  },
  {
    'title': 'Blog 2',
    'author': 'Author 2',
    'url': 'www.link2.com',
    'likes': 1
  }
]

// const initialUsers = [
//   {
//     'userName': 'User 1',
//     'name': 'Name 1',
//     'password': 'pw1'
//   },
//   {
//     'userName': 'User 2',
//     'name': 'Name 2',
//     'password': 'pw2'
//   }
// ]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    url: 'www.willremovethissoon.com',
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { initialBlogs, nonExistingId, blogsInDb, usersInDb }