const mongoose = require('mongoose')
const logger = require('./utils/logger')

if (process.argv.length < 3) {
  logger.info('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

let url = ""

if (process.argv[5] === "test" || process.argv[3] === "test") {
  url =
  `mongodb+srv://User:${password}@cluster0.yo6ff.mongodb.net/notesAppTest?retryWrites=true&w=majority&appName=Cluster0`
} else {
  url =
  `mongodb+srv://User:${password}@cluster0.yo6ff.mongodb.net/notesApp?retryWrites=true&w=majority&appName=Cluster0`
}

/* 
const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority`
*/

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })
  
  const Note = mongoose.model('Note', noteSchema)
  
  const note = new Note({
    content: process.argv[3],
    important: process.argv[4]
  })
  
  
  note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })
  
  Note.find({}).then(result => {
    result.forEach(note => {
      logger.info(note)
    })
    mongoose.connection.close()
  })
})