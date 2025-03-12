const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// GET all blogs
blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', {
      userName: 1,
      name: 1 })
  response.json(blogs)
})

// POST a new blog
blogsRouter.post('/api/blogs', async (request, response) => {
  const user = request.user

  const newBlog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id
  })

  const savedBlog = await newBlog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// GET single blog by id
blogsRouter.get('/api/blogs/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).json({ error: 'blog not found' })
  }
})

// DELETE single blog by id
blogsRouter.delete('/api/blogs/:id', async (request, response) => {
  const user = request.user

  const blogId = request.params.id
  const blog = await Blog.findById(blogId)
  if (!blog || !blog.user) {
    return response.status(404).json({ error: 'blog does not exist' })
  }

  if (user._id.toString() !== blog.user._id.toString()) {
    return response.status(401).json({ error: `user  ${user.name} is not the owner of this blog` })
  }

  // Step 1: Remove the blog reference from the user's blogs array
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $pull: { blogs: blogId } },
    { new: true }
  )
  if (!updatedUser) {
    return response.status(401).json({ error: 'Owner of the blog not found' })
  }

  // Step 2: Delete the blog from the Blog collection
  const deletedBlog = await Blog.findByIdAndDelete(blogId)
  if (!deletedBlog) {
    return response.status(401).json({ error: 'failed to delete blog' })
  }

  response.status(204).end()
})

// PUT Update single blog by id
blogsRouter.put('/api/blogs/:id', async (request, response) => {
  const user = request.user

  const blogId = request.params.id
  const blog = await Blog.findById(blogId)
  if (!blog || !blog.user) {
    return response.status(404).json({ error: 'blog does not exist' })
  }

  if (user._id.toString() !== blog.user._id.toString()) {
    return response.status(401).json({ error: `user  ${user.name} is not the owner of this blog` })
  }

  const newBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(blogId, newBlog,
    { new: true, runValidators: true, context: 'query' })
  if (!updatedBlog) {
    return response.status(404).json({ error: 'failed to update blog' })
  }

  return response.json(updatedBlog)
})

module.exports = blogsRouter