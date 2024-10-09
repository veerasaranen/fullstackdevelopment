const Blog = require('../models/blog')

const initialBlogs = [
    {
      author: "Crazy cats",
      title: "Cat Lady",
      url: "http://catsrule",
      likes: 12
    },
    {
      author: "Lovely dogs",
      title: "Dog Lady",
      url: "http://dogsrule",
      likes: 23
    },
  ]

  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }
  
  module.exports = {
    initialBlogs, blogsInDb
  }