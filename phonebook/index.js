const express = require('express')
const app = express()

let persons = [
    {
        id: 1, 
        name: "Arto Hellas",
        number: "040-123456"
    },

    {
        id: 3, 
        name: "Jack Player",
        number: "250-555-5555"
    },

    {
        id: 2, 
        name: "CM Punk",
        number: "654-999-5555"
    },

    {
        id: 4, 
        name: "Bill Clinton",
        number: "345-999"
    },
]

app.use(express.json())


const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

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


// Get full collection
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Get individual resource
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find((p) => p.id === parseInt(id))
    
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

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

    const newEntry = {
        id: generateId(),
        date: new Date(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newEntry)
    response.json(newEntry)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})