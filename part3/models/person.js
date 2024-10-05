const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

/*const validateNumber = () => {
  return 
} 
validate: {
  validator: validateNumber(), 
  message: props => `${props}`
} */

const personSchema = new mongoose.Schema({
  name: { 
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        const re = new RegExp(/^\d{2,3}-\d+$/)
        return re.test(v)
      },
      message: "Invalid phonenumber"
    }
  } 
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)