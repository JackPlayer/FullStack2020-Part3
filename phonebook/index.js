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


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})