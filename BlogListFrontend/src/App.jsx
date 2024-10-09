// I realized this is unnecessary so I did not finish the functionality of the front end (it is not working and I know it)

import { useState, useEffect } from 'react'
import Blog from '../components/Blog'
import AddBlogs from '../components/AddBlogs'
import blogService from '../services/blogs'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState('')

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs=> {
        setBlogs(initialBlogs)
      })
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes
    }
  
    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setNewLikes('')
      })
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  return (
    <div>
      <h1>Blogs</h1>     
      <ul>
        {blogs.map(blog => 
          <Blog
            key={blog.id}
            title={blog.title}
            author={blog.author}
            url={blog.url}
            likes={blog.likes}
          />
        )} 
      </ul>
      <AddBlogs 
        blog={addBlog} 
        title={newTitle} 
        addTitle={handleTitleChange} 
        author={newAuthor} 
        addAuthor={handleAuthorChange} 
        url={newUrl} 
        addUrl={handleUrlChange}
      />
    </div>
  )
}

export default App