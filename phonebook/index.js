require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan((tokens, req, res) => {
    const data = (tokens.method(req, res) === "POST") ? JSON.stringify(req.body) : ''
    return [
        tokens.method(req,res),
        tokens.url(req,res),
        tokens.status(req,res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        data
        
    ].join(' ')
}))

const persons = [

]

// Info Page
app.get('/info', (request, response) =>{
    const date = new Date()
    const info = 
        `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
        `
    response.send(info)
})

// README Page
app.get('/readme', (request, response) => {
    response.sendFile('./README.md', { root: __dirname})

})

// Get full collection
app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons)
    })
    
})

// Get individual resource
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    
    Person.findById(id).then((person) => {
        response.json(person)
    })

})

// Delete entry
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter((p) => p.id !== id)

    response.status(204).end()

})

// Add entry
app.post('/api/persons', (request, response) => {

    const body = request.body

    if(!body.number || !body.name) {
        return response.status(400).json({
            error: 'name or number are missing from content'
        })
    }

    if (persons.find((e) => e.name === body.name)) {
        return response.status(400).json({
            error: 'the name must be unique'
        })
    }

    const newEntry = new Person({
        date: new Date(),
        name: body.name,
        number: body.number
    })

    newEntry.save().then(savedPerson => {
        response.json(savedPerson)
    })
    
})

// Update entry
app.put(('/api/persons/:id'), (request, response) => {
    console.log("Put request")
    const id = Number(request.params.id)
    const person = persons.find((e) => e.id == id)

    if (!person || !request.body || !request.body.number) {
        response.status(400).end()
    }
    const updatedEntry = {
        ...person,
        number: request.body.number
    }

    persons = persons.map((person) => person.id === id ? updatedEntry : person)
    response.json(updatedEntry)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})