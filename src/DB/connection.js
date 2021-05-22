
const mongoose = require('mongoose')

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/CoSafe'

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})