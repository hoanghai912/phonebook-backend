const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

// console.log('Connecting to', url)

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => console.log('Error', error))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString()
    delete returnObject._id
    delete returnObject.__v
  }
})

module.exports = mongoose.model('Persons', personSchema)