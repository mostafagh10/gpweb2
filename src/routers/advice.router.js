
const router = require('express').Router()
const Advice = require('../models/advice.model')
const authAdmin = require('../middlewares/authAdmin')

// to get all advices
/*
    Pagination
*/
router.get('/', async (req, res) => {
    try {
        const advices = await Advice.find()
        res.status(200).send(advices)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

// to get an advice 
router.get('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const advice = await Advice.findById(id)
        if(!advice){
            return res.status(404).send()
        }
        res.status(200).send(advice)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

// to add a new advice
router.post('/', async (req, res) => {
    try {
        const advice = new Advice(req.body)
        await advice.save()
        res.status(200).send(advice)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// to edit an advice
router.patch('/:id', async (req, res) => {
    /*
    const updates = Object.keys(req.body)
    const allowedUpdates = []
    const isAllowed = updates.every(update => allowedUpdates.includes(update))
    if(!isAllowed){
        throw new Error()
    }
    */
    const updates = Object.keys(req.body)
    const {id} = req.params
    console.log("req.body : ",req.body)
    console.log("id : ",id)
    try {
        const advice = await Advice.findById(id)
        if(!advice){
            res.status(404).send('not found an advice')
        }
        updates.forEach(update => advice[update] = req.body[update])
        await advice.save()
        res.status(200).send(advice)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

// to delete an advice
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        await Advice.findByIdAndDelete(id)
        res.status(200).send()
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})



module.exports = router