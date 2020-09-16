require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const { response } = require('express')


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
    let info = '<p>No info available</p>'
    Person
        .find({})
        .then((persons) => {
            info = 
            `
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${date}</p>
            `
            response.send(info)
        })
        .catch((error) => {
            console.error(error)
            response.send(info)
        })
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
    .catch(error => next(error))
    
})

// Get individual resource
app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    
    Person.findById(id).then((person) => {
        response.json(person)
    })
    .catch((error) => next(error))

})

// Delete entry
app.delete('/api/persons/:id', (request, response, next) => {
    console.log("Requested")
    Person.findByIdAndRemove(request.params.id)
        .then((result) => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })

})

// Add entry
app.post('/api/persons', (request, response, next) => {

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
    .catch(error => next(error))
    
})

// Update entry
app.put(('/api/persons/:id'), (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then((updatedPerson) => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }
    next(error)
   
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})