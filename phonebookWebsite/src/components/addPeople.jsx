const AddPeople = ({person, name, addName, number, addNumber}) => {
  return (
    <form onSubmit={person}>
      <div>
        Name: 
        <input 
          value={name} 
          onChange={addName}
        />
      </div>
      <div>
        Number: 
        <input 
          value={number}
          onChange={addNumber}
        />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

export default AddPeople