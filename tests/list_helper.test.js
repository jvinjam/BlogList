const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

//dummy function
test('dummy returns 1', () => {
  const blogs = []

  const result = listHelper.dummy([blogs])
  assert.strictEqual(result, 1)
})

//total likes
describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const blogs = [
      { likes: 10 }
    ]

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 10)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      { likes: 5 },
      { likes: 10 },
      { likes: 15 },
      { likes: 20 }
    ]

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 50)
  })
})

//favorite blog
describe('favorite blog', () => {
  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog equals the blog', () => {
    const blogs = [
      { title: 'Title for one blog',
        author: 'Author 1',
        likes: 10 }
    ]

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[0])
  })

  test('of a bigger list is the blog with the most likes', () => {
    const blogs = [
      { title: 'Title a', author: 'Author a', likes: 5 },
      { title: 'Title d', author: 'Author d', likes: 20 },
      { title: 'Title b', author: 'Author b', likes: 10 },
      { title: 'Title c', author: 'Author c', likes: 15 },
    ]

    const result = listHelper.favoriteBlog(blogs)
    console.log('favorite blog in a big list: ', result)
    assert.deepStrictEqual(result, blogs[1])
  })

  test('of a list with multiple blogs with same number of likes', () => {
    const blogs = [
      { title: 'Title a', author: 'Author a', likes: 5 },
      { title: 'Title d', author: 'Author d', likes: 20 },
      { title: 'Title c', author: 'Author c', likes: 15 },
      { title: 'Title e', author: 'Author e', likes: 20 },
      { title: 'Title b', author: 'Author b', likes: 10 },
    ]

    const result = listHelper.favoriteBlog(blogs)
    console.log('multiple favorite blogs: ', result)
    assert.deepStrictEqual(result, blogs[3])
  }
  )
})

//most popular author
describe('most blogs', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog equals the blog', () => {
    const blogs = [
      { title: 'Title for one blog',
        author: 'Author 1',
        likes: 10 }
    ]

    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Author 1', blogs: 1 })
  })

  test('of a bigger list is the blog with the most blogs', () => {
    const blogs = [
      { title: 'Title a', author: 'Author a', likes: 5 },
      { title: 'Title b', author: 'Author b', likes: 10 },
      { title: 'Title c', author: 'Author a', likes: 15 },
      { title: 'Title d', author: 'Author d', likes: 20 }
    ]

    const result = listHelper.mostBlogs(blogs)
    console.log('most blogs in a big list: ', result)
    assert.deepStrictEqual(result, { author: 'Author a', blogs: 2 })
  })

  test('of a list with multiple authors with same number of blogs', () => {
    const blogs = [
      { title: 'Title a', author: 'Author a', likes: 5 },
      { title: 'Title b', author: 'Author b', likes: 10 },
      { title: 'Title c', author: 'Author a', likes: 15 },
      { title: 'Title d', author: 'Author b', likes: 20 },
      { title: 'Title e', author: 'Author e', likes: 20 },
    ]

    const result = listHelper.mostBlogs(blogs)
    console.log('multiple authors with most blogs: ', result)
    assert.deepStrictEqual(result, { author: 'Author b', blogs: 2 })
  }
  )
})

//most likes
describe('most likes', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog equals the blog', () => {
    const blogs = [
      { title: 'Title for one blog',
        author: 'Author 1',
        likes: 10 }
    ]

    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Author 1', likes: 10 })
  })

  test('of a bigger list is the blog with the most likes', () => {
    const blogs = [
      { title: 'Title a', author: 'Author a', likes: 5 },
      { title: 'Title b', author: 'Author b', likes: 20 },
      { title: 'Title c', author: 'Author c', likes: 15 },
      { title: 'Title d', author: 'Author d', likes: 10 }
    ]

    const result = listHelper.mostLikes(blogs)
    console.log('most likes in a big list: ', result)
    assert.deepStrictEqual(result, { author: 'Author b', likes: 20 })
  })

  test('of a bigger list is the blog with the most likes (author has mutiple titles)', () => {
    const blogs = [
      { title: 'Title d', author: 'Author a', likes: 20 },
      { title: 'Title d', author: 'Author d', likes: 20 },
      { title: 'Title b', author: 'Author b', likes: 10 },
      { title: 'Title a', author: 'Author a', likes: 5 },
      { title: 'Title d', author: 'Author b', likes: 20 },
      { title: 'Title c', author: 'Author c', likes: 15 },
    ]

    const result = listHelper.mostLikes(blogs)
    console.log('most likes in a big list (author has mutiple titles): ', result)
    assert.deepStrictEqual(result, { author: 'Author b', likes: 30 })
  })

  test('of a list with multiple authors with same number of likes', () => {
    const blogs = [
      { title: 'Title a', author: 'Author a', likes: 5 },
      { title: 'Title b', author: 'Author b', likes: 10 },
      { title: 'Title c', author: 'Author a', likes: 15 },
      { title: 'Title d', author: 'Author b', likes: 20 },
      { title: 'Title e', author: 'Author e', likes: 20 },
      { title: 'Title f', author: 'Author a', likes: 10 },
    ]

    const result = listHelper.mostLikes(blogs)
    console.log('multiple authors with most blogs: ', result)
    assert.deepStrictEqual(result, { author: 'Author b', likes: 30 })
  }
  )
})