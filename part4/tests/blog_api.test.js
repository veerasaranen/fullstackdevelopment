const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('apis regarding the blogs', () => {
  test('there is the right amount of blogs, and blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('the unique identifier is called id not _id', async () => {
    const blogsAtEnd = await helper.blogsInDb()

    blogsAtEnd.forEach( blog => {
      assert(blog.hasOwnProperty("id"))
      assert(!blog.hasOwnProperty("_id"))
    })
  })

  test("POST request to /api/blogs creates a new blog successfully", async () => {
    const response = await api
                      .post('/api/login')
                      .send({ username: 'root', password: 'sekret' })
                      .expect(200)
                      .expect('Content-Type', /application\/json/)

    const token =  response.body.token

    const blog = {
      title: "test blog",
      author: "the tester",
      url: "http://testingrocks",
      likes: 120
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map( blog => blog.title )
    assert(titles.includes('test blog'))

    const authors = blogsAtEnd.map( blog => blog.author )
    assert(authors.includes('the tester'))

    const urls = blogsAtEnd.map( blog => blog.url )
    assert(urls.includes('http://testingrocks'))

    const likes = blogsAtEnd.map( blog => blog.likes )
    assert(likes.includes(120))
  })

  test("POST request to /api/blogs fails if token is invalid", async () => {
    const response = await api
                      .post('/api/login')
                      .send({ username: 'root', password: 'sekret' })
                      .expect(200)
                      .expect('Content-Type', /application\/json/)

    const token =  response.body.token

    const blog = {
      title: "test blog",
      author: "the tester",
      url: "http://testingrocks",
      likes: 120
    }

    const result = await api
                    .post('/api/blogs')
                    .send(blog)
                    .expect(401)
    
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    assert(result.body.error.includes('token invalid'))
  })

  test('Likes property defaults to 0', async () => {
    const response = await api
                      .post('/api/login')
                      .send({ username: 'root', password: 'sekret' })
                      .expect(200)
                      .expect('Content-Type', /application\/json/)

    const token =  response.body.token

    const likelessBlog = {
      title: "test blog",
      author: "the tester",
      url: "http://testingrocks",
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(likelessBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // the added blog should be third in the database

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd[2].likes, 0)
  })

  test('If title is missing, returns status code 400', async () => {
    const response = await api
                      .post('/api/login')
                      .send({ username: 'root', password: 'sekret' })
                      .expect(200)
                      .expect('Content-Type', /application\/json/)

    const token =  response.body.token

    const untitledBlog = {
      author: "the tester",
      url: "http://testingrocks",
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(untitledBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('If URL is missing, returns status code 400', async () => {
    const response = await api
                      .post('/api/login')
                      .send({ username: 'root', password: 'sekret' })
                      .expect(200)
                      .expect('Content-Type', /application\/json/)

    const token =  response.body.token

    const noURLBlog = {
      title: "test blog",
      author: "the tester",
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(noURLBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('deleting a blog works if id is valid', async () => {
    const blogsAtFirst = await helper.blogsInDb()
    const blog = blogsAtFirst[0]

    await api
      .delete(`/api/blogs/${blog.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const ids = blogsAtEnd.map( blog => blog.id )
    assert(!ids.includes(blog.id))
  })

  test('deleting a blog does not work with an invalid id', async () => {
    const blogsAtFirst = await helper.blogsInDb()
    const blog = blogsAtFirst[0]

    await api
      .delete(`/api/blogs/123`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('updating a blog works if id is valid', async () => {
    const blogsAtFirst = await helper.blogsInDb()
    const blog = blogsAtFirst[0]

    updatedBlog = {
      likes: 22
    }

    await api
      .put(`/api/blogs/${blog.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    assert.strictEqual(blogsAtEnd[0].likes, updatedBlog.likes)
  })

  test('updating a blog does not work with an invalid id', async () => {
    const blogsAtFirst = await helper.blogsInDb()
    const blog = blogsAtFirst[0]

    updatedBlog = {
      likes: 22
    }

    await api
      .put(`/api/blogs/123`)
      .send(updatedBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd[0].likes, blog.likes)
  })
})

describe('when there is one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

  })

  test('creation succeeds with a fresh username', async () => {
    
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Veeris',
      name: 'Veera',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })


  test('creation fails with proper statuscode and message if username already taken', async () => {

    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is missing', async () => {
    
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Harry',
      name: 'user1',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('missing password'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Harry',
      name: 'user1',
      password: 's',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    console.log(result.body.error)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('invalid password'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is missing', async () => {
    
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('User validation failed:'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "a",
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('User validation failed:'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})