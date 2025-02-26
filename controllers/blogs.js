const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// GET all blogs
blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

// GET single blog by id
// blogsRouter.get('/:id', (request, response, next) => {
//   Blog.findById(request.params.id)
//     .then(blog => {
//       if (blog) {
//         response.json(blog)
//       } else {
//         response.status(404).json({ message: 'Blog not found' })
//       }
//     })
//     .catch(error => {
//       next(error)
//     })
// })

// POST a new blog
blogsRouter.post('/', (request, response) => {
  const newBlog = new Blog(request.body)

  newBlog.save()
    .then(result => {
      response.status(201).json(result)
    })
    //blog => response.json(blog))
})

module.exports = blogsRouter