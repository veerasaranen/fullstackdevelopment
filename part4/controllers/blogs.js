const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
//const User = require('../models/user')
require('express-async-errors')
const { usersInDb } = require('../tests/test_helper')
const middleware = require('../utils/middleware');


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})
  
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user//await User.findById(decodedToken.id)

  //const user = await User.findById(body.userId) exercise 4.17

  if (!body.hasOwnProperty('title')) {
    return response.status(400).send({ error: 'title missing' })
  }

  if (!body.hasOwnProperty('url')) {
    return response.status(400).send({ error: 'url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id 
  })
  
  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

  const creator = await Blog.findById(request.params.id)
  const user = request.user

  if (creator.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'can not delete posts made by other users, token invalid'})
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const body = request.body

  // you can only update the likes, other stuff is ignored

  const newBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: body.likes || 0
  }

  const updated = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
  response.json(updated)

})

module.exports = blogsRouter