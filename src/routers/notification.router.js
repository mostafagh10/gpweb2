
const router = require('express').Router()
const authUser = require('../middlewares/authUser')
const {
    createNotification,
    getNotification
} = require('../controllers/notification.controller')


router.post('/', authUser, createNotification)
router.get('/:id', authUser, getNotification)


module.exports = router