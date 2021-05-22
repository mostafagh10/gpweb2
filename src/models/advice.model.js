
const mongoose = require('mongoose')

const adviceSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required!'],
        trim: true
    },
    body: {
        type: String,
        required: [true, 'body is required!'],
        trim: true
    },
    image: {
        type: String,
    }
})

const adviceModel = mongoose.model('Advice', adviceSchema)

module.exports = adviceModel