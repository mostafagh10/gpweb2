
const mongoose = require('mongoose')

/**
 * Notification is work when i find an infected one or when i met uninfected and become infected
 * Notification is for one user
 */

const notificationSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required!'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'message is required!'],
        trim: true
    },
    icon: {
        type: String,
        required: [true, 'icon is required!']
    },
    date: {
        type: Date,
        default: new Date().toLocaleString()
    },
    // owner: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User',
    //     autopopulate: { select: "firstName lastName" },
    // }
})

const notificationModel = mongoose.model('Notification', notificationSchema)

module.exports = notificationModel