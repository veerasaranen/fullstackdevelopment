import { useState, useEffect } from 'react'
import SearchField from './components/search.jsx'
import AddPeople from './components/addPeople.jsx'
import People from './components/people.jsx'
import peopleService from './services/people.js'
import Notification from './components/notification.jsx'
import Error from './components/error.jsx'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [filtered, setNewFiltered] = useState(persons)
  const [notification, setNewNotification] = useState(null)
  const [error, setNewError] = useState(null)

  const hook = () => {
    peopleService
      .getAll()
      .then(initialPeople => {
        setPersons(initialPeople)
        setNewFiltered(initialPeople)
      })
  }

  useEffect(hook, [])

  // you can't add the same person with different lower or upper case letters either
  const addPerson = (event) => {
    event.preventDefault()
    const sameName = persons.filter( person => person.name.toLowerCase() === newName.toLowerCase() )
    if (sameName.length === 0) {
      const personObject = {
        name: newName,
        number: newNumber,
      } 
      peopleService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewFiltered(filtered.concat(returnedPerson))
          setNewNumber("")
          setNewName("")
        })
      setNewNotification(`${newName} was successfully added to contacts`)
      setTimeout(() => {
        setNewNotification(null)
      }, 5000)
    } else {
      //alert(`${newName} is already added to phonebook`), i commented the old exercice
      if (window.confirm(`${newName} is already added to phonebook. Do you want to replace the old contact?`)) {
        const changing = persons.find( person => person.name.toLowerCase() === newName.toLowerCase() )
        const changedPerson = { ...changing, number: newNumber }
        peopleService
          .change(changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== changing.id ? person : returnedPerson))
            setNewFiltered(filtered.map(person => person.id !== changing.id ? person : returnedPerson))
            setNewNumber("")
            setNewName("")
            setNewNotification(`${newName} was changed`)
            setTimeout(() => {
              setNewNotification(null)
            }, 5000)
          })
          .catch(error => {
            setNewError(`Oops, ${newName} was already deleted from server`)
            setTimeout(() => {
              setNewNotification(null)
            }, 5000)
          })
      } else {
        setNewNotification(`changes to ${newName} were canceled`)
        setTimeout(() => {
          setNewNotification(null)
        }, 5000)
        setNewNumber("")
        setNewName("")
      }
    }
  
  }

  const handleNames = (event) => {
    setNewName(event.target.value)
  }

  const handleNumbers = (event) => {
    setNewNumber(event.target.value)
  }

  const filterSearch = (event) => {
    event.preventDefault()
    setNewSearch(event.target.value)
    const search = event.target.value.toLowerCase()
    const filteredPersons = persons.filter( person => person.name.toLowerCase().includes(search))
    setNewFiltered(filteredPersons)
  }

  const handleDelete = (person) => {
    if (window.confirm(`Do you really want to delete ${person.name}?`)) {
      peopleService
        .deleting(person.id)
      setPersons(persons.filter(dude => dude.id !== person.id))
      setNewFiltered(filtered.filter(dude => dude.id !== person.id))
      setNewNotification(`${person.name} was deleted from contacts`)
      setTimeout(() => {
        setNewNotification(null)
      }, 5000)
    } else {
      setNewNotification(`deletion of ${person.name} was canceled`)
      setTimeout(() => {
        setNewNotification(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Error message={error} />
      <Notification message={notification} />
      <SearchField input={newSearch} filter={filterSearch}/>
      <h3>Add a contact</h3>
      <AddPeople person={addPerson} name={newName} addName={handleNames} number={newNumber} addNumber={handleNumbers}/>
      <h3>Numbers</h3>
      <People filteredList={filtered} deleting={handleDelete}/>
    </div>
  )
}

export default App
