const dummy = (blogs) => {
  console.log('dummy called ', blogs)
  return 1
}

const totalLikes = (blogs) => {
  return (blogs.length === 0) ? 0 : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const blogCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts
  }, {})
  const obj = Object.entries(blogCounts).reduce((prev, current) => (prev[1] > current[1])? prev : current)
  return { author: obj[0], blogs: obj[1] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const likeCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + blog.likes
    return counts
  }, {})
  const obj = Object.entries(likeCounts).reduce((prev, current) => (prev[1] > current[1])? prev : current)
  return { author: obj[0], likes: obj[1] }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }