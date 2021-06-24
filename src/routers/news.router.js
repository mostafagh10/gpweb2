
const router = require('express').Router()
const NewsModel = require('../models/news.model')

// to get all news
router.get('/', async (req, res) => {
    try {
        const news = await NewsModel.find()
        res.status(200).send(news)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

// to get a news 
router.get('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const news = await NewsModel.findById(id)
        if(!news){
            return res.status(404).send()
        }
        res.status(200).send(news)

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

// to add a new news
router.post('/', async (req, res) => {
    try {
        const News = new NewsModel(req.body)
        await News.save()
        res.status(200).send(News)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

// to edit a news
router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const {id} = req.params
    console.log("req.body : ",req.body)
    console.log("id : ",id)
    try {
        const news = await NewsModel.findById(id)
        if(!news){
            res.status(404).send('not found an news')
        }
        updates.forEach(update => news[update] = req.body[update])
        await news.save()
        res.status(200).send(news)

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

// to delete a news
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        await NewsModel.findByIdAndDelete(id)
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})








module.exports = router