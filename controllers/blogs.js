const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// GET all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// POST a new blog
blogsRouter.post('/', async (request, response) => {
  const newBlog = new Blog(request.body)

  const savedBlog = await newBlog.save()
  response.status(201).json(savedBlog)
  //blog => response.json(blog))
})

// GET single blog by id
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).json({ error: 'blog not found' })
  }
})

// DELETE single blog by id
blogsRouter.delete('/:id', async (request, response) => {
  // if (!request.params.id) {
  //   return response.status(400).json({ error: 'id missing' })
  // }

  const blog = await Blog.findByIdAndDelete(request.params.id)
  if (blog) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

// PUT Update single blog by id
blogsRouter.put('/:id', async (request, response) => {
  const newBlog = {}

  if (request.body.title) newBlog.title = request.body.title
  if (request.body.author) newBlog.author = request.body.author
  if (request.body.url) newBlog.url = request.body.url
  if (request.body.likes) newBlog.likes = request.body.likes

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog,
    { new: true, runValidators: true, context: 'query' })

  if (!updatedBlog) {
    return response.status(404).json({ error: 'blog not found' })
  } else {
    return response.json(updatedBlog)
  }
})

module.exports = blogsRouter