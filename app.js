const express = require('express')
const pug = require('pug')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/rsvp')

const Schema = mongoose.Schema

const rsvpSchema = new Schema({
    name: {type: String, require: true},
    email: String,
    isGoing: {type: Boolean, require: true},
    guests: Number
})

const rsvpData = mongoose.model('rsvpData', rsvpSchema)

const app = express()

app.use(express.urlencoded())
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/guests', (req, res) => {
    rsvpData.find()
        .then(function(doc) {
            console.log(doc)
            res.render('guests', {guests: doc})
        })
})

app.post('/reply', (req, res) => {
    let isGoing
    if (Number(req.body.rsvp)) isGoing = true
    else isGoing = false
    const data = {
        name: req.body.name,
        email: req.body.email,
        isGoing: isGoing,
        guests: req.body.guests
    }

    const newGuest = new rsvpData(data)
    newGuest.save()

    res.render('added', {name: req.body.name, isGoing: isGoing})
})

app.listen(3000, () => {
    console.log("App started on port: 3000!")
})