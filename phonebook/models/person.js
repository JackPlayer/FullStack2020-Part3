const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

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
    name: {
        type: String,
        minlength: 1,
        required: true,
        unique: true
    },
    number: {
        type: String,
        minlength: 1,
        required: true,
    },
    date: {
        type: Date, 
        required: true,
    },
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)