const express = require('express')
const app = express()
const cors = require('cors')

// DB Connection
require('./DB/connection')

// Main middlewares
app.use(express.json())

// Access API
// https://co-safe.netlify.app
// origin:['http://localhost:3000','http://127.0.0.1:3000']
const URL = process.env.FE_URL || "http://localhost:3000"
app.use(cors({
    origin:[URL, URL],
    credentials: true
}))
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', URL);
    res.header('Access-Control-Allow-Headers', true);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next()
})


// Routers
const adminRouter = require('./routers/admin.router')
const userRouter = require('./routers/user.router')
const userRouter2 = require('./routers/user2.router')
const newsRouter = require('./routers/news.router')
const adviceRouter = require('./routers/advice.router')
const notificationRouter = require('./routers/notification.router')
const conversationRoute = require("./routers/conversation")
const messageRoute = require("./routers/message")


// Routes
app.use('/user/admin', adminRouter)
app.use('/user/client', userRouter)
app.use('/news', newsRouter)
app.use('/advice', adviceRouter)
app.use('/user/client/notification', notificationRouter)
app.use("/conversations", conversationRoute);
app.use("/messages", messageRoute);


// No route matched, 404 not found
app.use((req, res, next)=>{
    res.status(404).send(`${req.originalUrl} is not exist`)
})


const PORT = process.env.PORT || 3500
const server = app.listen(PORT, () => console.log(`server is up on port ${PORT}`))