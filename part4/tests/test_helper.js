const Blog = require('../models/blog')
const User = require('../models/user')

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

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }
  
  module.exports = {
    initialBlogs,
    blogsInDb,
    usersInDb,
  }
  