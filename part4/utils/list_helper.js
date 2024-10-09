const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  const likes = blogs.map( blog => blog.likes )
    
  return likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return "no favorite"
  } else {
    const likes = blogs.map( blog => blog.likes )
    const favorite = likes.reduce((a, b) => Math.max(a,b), -Infinity)
    const favoriteObject = blogs.find( blog => blog.likes === favorite )

    return {
      title: favoriteObject.title,
      author: favoriteObject.author,
      likes: favoriteObject.likes,
    }
  }  
}
  
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}

