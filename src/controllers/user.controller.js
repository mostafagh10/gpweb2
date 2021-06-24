
const User = require('../models/user.model')
const { generateToken } = require('../Utils/Helpers')

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const getUserByAdmin = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send()
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const getUser = async (req, res) => {
    //res.status(200).send(req.user)
    try {
        res.status(200).send(req.user)
      } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const signup = async (req, res) => {
    try {
        const user = new User({ ...req.body })
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token !== req.token)
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const logoutFromAllDevices = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const editUserByAdmin = async (req, res) => {
    const updates = Object.keys(req.body)
    /*
    const allowedUpdates = [] // allowed updates for admin
    const isAllowed = updates.every(update => allowedUpdates.includes(update))
    if (!isAllowed) {
        throw new Error()
    }
    */
    const id = req.params.id
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send('not found a user')
        }
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const editUser = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [] // allowed updates
    const isAllowed = updates.every(update => allowedUpdates.includes(update))
    if (!isAllowed) {
        throw new Error()
    }
    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const deleteUserByAdmin = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findByIdAndDelete({ _id: id })
        await user.save()
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

//////////// when i delete it, must delete all notifications ////////////
const deleteUser = async (req, res) => {
    try {
        await req.user.remove()
        // req.user.save() // i think it will not be work
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const addInfectedPatient = async (req, res) => {
    /*
    const { id } = req.params
    try {
        const user = await User.findById(id)
        if(!user){
            return res.status(404).send('not found')
        }
    */
   try{
    const exist = await User.findOne({email : req.body.email})

    if(exist){
        return res.status(400).json({
            error:'this email already exists'
        })
    }
    const user = new User({ ...req.body })
        user.isInfected = true
        // When the user be infected, i should notify all users their has the userID in metUnInfectedUsers
        await user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const clearUnInfectedTable = async (req, res)=>{
    const { id } = req.params
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send('not found')
        }
        user.metUnInfectedUsers = []
        await user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const checkWithinDay = async (req, res)=>{
    try {
        // still
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const updateTheStatusOfUnInfectedUsers = async (req, res) => {
    try {
        // still
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const addUnInfectedUser = async (req, res)=>{
    const { id } = req.body
    const user = await User.findById(id)
    if(!user){
        throw new Error('no user is exist')
    }
    try {
        req.user.metUnInfectedUsers = [...req.user.metUnInfectedUsers, { unInfectedUserID: id }]
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}
module.exports = {
    getUsers,
    getUserByAdmin,
    getUser,
    signup,
    login,
    logout,
    logoutFromAllDevices,
    editUserByAdmin,
    editUser,
    deleteUserByAdmin,
    deleteUser,
    addInfectedPatient,
    clearUnInfectedTable,
    checkWithinDay,
    updateTheStatusOfUnInfectedUsers,
    addUnInfectedUser
}