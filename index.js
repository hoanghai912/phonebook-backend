const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(cors())

morgan.token('body', (req) => {
  if (req.method === 'POST' && req.body !== null)
    return JSON.stringify(req.body)
  return undefined
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))

// let persons = [
//   {
//     'id': '1',
//     'name': 'Arto Hellas',
//     'number': '040-123456'
//   },
//   {
//     'id': '2',
//     'name': 'Ada Lovelace',
//     'number': '39-44-5323523'
//   },
//   {
//     'id': '3',
//     'name': 'Dan Abramov',
//     'number': '12-43-234345'
//   },
//   {
//     'id': '4',
//     'name': 'Mary Poppendieck',
//     'number': '39-23-6423122'
//   }
// ]

const Person = require('./models/person')
// const generateID = () => {
//   return Math.floor(Math.random() * 10000)
// }

app.get('/', (req, res) => {
  res.send('<h1>Welcome to my API persons. Go to <a href="/api/persons">/api/persons</a> to have more information</h1>')
})

app.get('/api/persons', (req, res, next) => {
  // res.json(persons)
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.find({}).then(persons => {
    res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>  
    `)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      console.log(person)
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      if (result) res.status(204).end()
      else res.status(404).end()
    })
    .catch(error => {
      next(error)
    })

})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  // if (!body || !body.name || !body.number) {
  //   return res.status(400).json({
  //     error: "Name or Number is missing"
  //   })
  // }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })
  newPerson.save()
    .then(person => res.json(person))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body
  // if (!body) {
  //   return res.status(400).end()
  // }
  const newPerson = { name: body.name, number: body.number }
  Person.findByIdAndUpdate(id, newPerson, { new: true, runValidators: true, context: 'query' })
    .then(updatePerson => res.json(updatePerson))
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  return res.status(404).json({ error: 'Unknown Endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})