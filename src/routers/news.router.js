
const router = require('express').Router()
const NewsModel = require('../models/news.model')

// to get all news
router.get('/', async (req, res) => {
    try {

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

// to get a news 
router.get('/:id', async (req, res) => {
    try {

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
    try {

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

// to delete a news
router.delete('/:id', async (req, res) => {
    try {

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})








module.exports = router