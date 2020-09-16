// MONGO DB Phonebook Application

const mongoose = require('mongoose')

if (process.argv.length < 5 && process.argv.length !== 3 ) {
    console.log('To add an entry to the DB: node mongo.js <password> <name> <number>')
    console.log('To get all entries in the DB: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const dbURL = `mongodb+srv://jplayer:${password}@cluster0.kzzw6.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
  })

const Person = mongoose.model('Person', personSchema)
if (newName && newNumber) {
  const newPerson = new Person({
    name: newName, 
    number: newNumber,
    date: new Date(),
  })

  newPerson.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()

  })

} else {
  Person.find({}).then((result) => {
    console.log('phonebook')
    result.forEach((e) => console.log(`${e.name} ${e.number}`))
    mongoose.connection.close()
  })

}

