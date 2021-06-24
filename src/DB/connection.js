
const mongoose = require('mongoose')

//const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/CoSafe'

const DB_URL = process.env.DB_URL || 'mongodb+srv://mostafaghazaly:tsaCFDK0LVvAPYdo@cluster0.lsbie.mongodb.net/CoSafe?retryWrites=true&w=majority'

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})