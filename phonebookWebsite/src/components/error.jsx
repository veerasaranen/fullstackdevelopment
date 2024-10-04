const Error = ({ message }) => {
    const errorStyle = {
      color: 'darkred',
      background: 'pink',
      fontSize: 15,
      marginBottom: 20
    }
  
    if (message === null) {
      return null
    }
    
    return (
      <div style={errorStyle}>
        {message}
      </div>
    )
  }
  
  export default Error