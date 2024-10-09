const Blog = ({key, title, author, url, likes }) => {
    return (
      <li className='blog'>
        {title} 
        {author}
        {url}
        {likes}
      </li>
    )
  }
  
  export default Blog