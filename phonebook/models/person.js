const mongoose = require('mongoose')
require('dotenv').config({path: '../.env'})

const url = process.env.MONGO

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((response) => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB")
    })
    
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)