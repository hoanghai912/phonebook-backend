const mongoose = require('mongoose')

if (process.argv.length<3) {
    process.exit()
}

const password = process.argv[2]

const url = `mongodb+srv://nockles:${password}@cluster0.yyegsl4.mongodb.net/phonebook?
            retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url)
mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = new mongoose.model('Persons', personSchema)

if (process.argv[3] && process.argv[4]) {
    const name = process.argv[3]
    const number = process.argv[4]
    const newPerson = new Person({name: name, number: number})
    newPerson.save().then(() => {
        console.log(`add ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}
else {
    Person.find({})
        .then(persons => {
            // console.log(persons)
            persons.forEach(person => console.log(person.name, person.number))
            mongoose.connection.close()
        })
}