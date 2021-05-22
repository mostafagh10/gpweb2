
const createNotification = async (req, res) => {
    try {
        const { title, message, icon, date = new Date().toLocaleString() } = req.body
        const notification = { title, message, icon, date }
        req.user.notifications = [...req.user.notifications, { notification }]
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const getNotification = async (req, res) => {
    const { id } = req.params
    try {
        const notification = req.user.notifications.find(notifi => notifi._id === id)
        if (!notification) {
            return res.status(404).send('not found')
        }
        res.status(200).send(notification)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

module.exports = {
    createNotification,
    getNotification
}