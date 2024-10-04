const People = ({filteredList, deleting}) => {
  return (
    <ul>
      {filteredList.map(person => 
        <div key={person.id}>
          <li>
            {person.name} {person.number}
          </li>
          <button onClick={() => deleting(person)}>Delete</button>
        </div>
      )}
    </ul>
  )
}

export default People