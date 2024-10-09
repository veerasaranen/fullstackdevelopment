const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
require('express-async-errors')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
  
  blogsRouter.post('/', async (request, response) => {
    const body = request.body

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
      likes: body.likes || 0
    })
  
    const result = await blog.save()
    response.status(201).json(result)
  })

  blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
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