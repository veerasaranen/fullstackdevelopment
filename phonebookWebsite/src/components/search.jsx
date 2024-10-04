const SearchField = ({input, filter}) => {
  return (
  <div>
    Search: 
    <input
      value={input}
      onChange={filter}
    />
  </div>
  )
}

export default SearchField