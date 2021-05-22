
const router = require('express').Router()
const Admin = require('../models/admin.model')
const authAdmin = require('../middlewares/authAdmin')
const bcrypt = require('bcrypt')

// to get all admins 
router.get('/', authAdmin, async (req, res) => {
    try {
        const admins = await Admin.find()
        res.status(200).send(admins)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

// to get an admin 
router.get('/me', authAdmin, async (req, res) => {
    res.status(200).send(req.admin)
})

// to add a new admin 
router.post('/addnewadmin', async (req, res) => {
    try {
        const exist = await Admin.findOne({email : req.body.email})

        if(exist){
            return res.status(400).json({
                error:'this email already exists'
            })
        }
        const admin = new Admin({ ...req.body })
        //const token = await admin.generateAuthToken()
        await admin.save()
        res.status(200).send({ admin/*, token*/ })
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

// to login as an admin
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const admin = await Admin.findByCredentials(email, password)
        const token = await admin.generateAuth()
        
        res.status(200).send({ admin, token })
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

// to edit an admin 
router.patch('/me', authAdmin, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'lastName', 'email', 'password']
    const isAllowed = updates.every(update => allowedUpdates.includes(update))
    if(!isAllowed){
        throw new Error()
    }
    try {
        updates.forEach(update => req.admin[update] = req.body[update])
        await req.admin.save()
        res.status(200).send(req.admin)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

// to delete an admin 
router.delete('/me', authAdmin, async (req, res) => {
    try {
        await req.admin.remove()
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

// to logout from a device
router.post('/logout', authAdmin, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter(token => token !== req.token)
        await req.admin.save()
        res.status(200).send({msg:"the admin logged out"})
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

// to logout from all devices
router.post('/logout-all', authAdmin, async (req, res) => {
    try {
        req.admin.tokens = []
        await req.admin.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})



module.exports = router