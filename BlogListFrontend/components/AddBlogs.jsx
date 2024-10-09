const AddBlogs = ({blog, title, addTitle, author, addAuthor, url, addUrl}) => {
    return (
      <form onSubmit={blog}>
        <div>
          Title: 
          <input 
            value={title} 
            onChange={addTitle}
          />
        </div>
        <div>
          Author: 
          <input 
            value={author}
            onChange={addAuthor}
          />
        </div>
        <div>
          Url: 
          <input 
            value={url}
            onChange={addUrl}
          />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    )
  }
  
  export default AddBlogs