
const mongoose = require('mongoose')

const newsSchema = mongoose.Schema({
    title:{
        type: String,
        required: [true, 'title is required!'],
        trim: true
    },
    body:{
        type: String,
        required: [true, 'body is required!'],
        trim: true
    },
    image:{
        type: String,
    },
    date:{
        type: Date,
        default: new Date().toLocaleString()
    },
    URL:{
        type: String
    }
})

const newsModel = mongoose.model('New', newsSchema)

module.exports = newsModel