require("dotenv").config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('body', (request, response) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  } else {
    return ' ' //returning an empty string to make the GET posts normal
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
// I use the tiny format written out to add the :body token, I had 'tiny' here before

app.get('/info', (request, response, next) => {
  let time = new Date()

  Person.find({}).then( people => {
    response.send(
      `<p>Phonebook has info for ${people.length} people</p>
       <p>${time}</p>
      `
    ) 
  })
  .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then( people => {
    response.json(people)
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  
  Person.findById(id).then( person => {
    response.json(person)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    }) 
  }

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    }) 
  }

  //Person.findOneAndUpdate({name: body.name}, {number: body.number})

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

/*
THE VERSION FOR EXERCICES 3.1-3.11

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (request, response) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  } else {
    return ' ' //returning an empty string to make the GET posts normal
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
// I use the tiny format written out to add the :body token, I had 'tiny' here before

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
] 

app.get('/info', (request, response) => {
  let time = new Date()

  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
     <p>${time}</p>
    `
  ) 
})

  app.get('/api/persons', (request, response) => {
    response.json(people)
  })

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find( person => person.id === id )

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const newId = Math.floor(Math.random() * 100000)
  return String(newId)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    }) 
  }

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    }) 
  }

  if (persons.find( person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    }) 
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

*/