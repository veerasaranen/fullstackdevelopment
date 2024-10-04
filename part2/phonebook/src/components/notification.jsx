const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'darkblue',
    background: 'lightblue',
    fontSize: 15,
    marginBottom: 20
  }

  if (message === null) {
    return null
  }
  
  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification