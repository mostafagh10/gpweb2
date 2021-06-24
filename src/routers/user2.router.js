
const router = require('express').Router()
const User = require('../models/user.model')
const authUser = require('../middlewares/authUser')
//const { sendPasswordVerificationCode } = require('../emails/mailer')
const { generateToken } = require('../Utils/Helpers')
const bcrypt = require('bcrypt')

// to get all users 
router.get('/',/*  authAdmin, */ async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
  })

  // to get an admin 
  router.post('/me', authUser, async (req, res) => {
    try {
      res.status(200).send(req.user)
    } catch (error) {
      res.status(500).send({ error: error.message })
    }
  })
  
 // to get an user 
router.get('/:id', /* authAdmin, */ async (req, res) => {
    const {id} = req.params
    try {
        const user = await User.findById(id)
        if(!user){
            return res.status(404).send()
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})
  
  // to get an user by name
  router.get('/find',/* authAdmin, */ async (req, res) => {
    let name;
    if (req.query.name){
      name = req.query.name
    }else{
      res.status(404).send("user name is missing")
    }
    try {
      const user = await User.findBy({ name })
      if(!user){
        res.status(404).send("user not found")
      }
      res.status(200).send(user)
    } catch (error) {
      res.status(500).send({ error: error.message })
    }
  })
  
// to add a new admin 
router.post('/infected', async (req, res) => {
    try {
        const exist = await User.findOne({email : req.body.email})

        if(exist){
            return res.status(400).json({
                error:'this email already exists'
            })
        }
        const user = new User({ ...req.body })
        //const token = await admin.generateAuthToken()
        await user.save()
        res.status(200).send({ user/*, token*/ })
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})
  
  // to login as an admin
  router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
  })
  
// to edit an admin 
router.patch('/:id',/* authAdmin, */ async (req, res) => {
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
})
  
// to delete an admin 
router.delete('/:id',/* authAdmin, */ async (req, res) => {
    const { id } = req.params
    try {
        //await req.admin.remove()
        await User.findByIdAndDelete(id)
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})
  
// to logout from a device
router.post('/logout', authUser, async (req, res) => {
    try {
        //req.admin.tokens = req.admin.tokens.filter(token => token !== req.token)
        req.user.tokens = req.user.tokens.filter(token => req.token !== token.token)
        await req.user.save()
        res.status(200).send({msg:"the user logged out"})
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})
  
// to logout from all devices
router.post('/logout-all', authUser, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})
  
  router.post('/password/forget', async (req, res) => {
    /*
    const email = req.body
    const admin = await Admin.findOne({ email })
    if (!admin) {
      res.status(400).send("not find doctor")
    }
    if (admin.passwordResetToken) {
      sendPasswordVerificationCode(admin.email, admin.name, admin.passwordResetToken, 'admin')
    } else {
      const code = await generateToken()
      admin.passwordResetToken = code
      sendPasswordVerificationCode(admin.email, admin.name, code)
      await admin.save()
    }
    res.status(200).send()
    */
    const user = await User.findOne({ email: req.body.email })
    if (!user){
      return res.status(404).send("user is not found")
    }
    if (user.verificationCode) {
      sendPasswordVerificationCode(user.email, user.name, 'user', user.verificationCode)
    } else {
    user.verificationCode= await generateToken(4)
    sendPasswordVerificationCode(user.email, user.name, 'user', user.verificationCode )
    await user.save()
  }
  res.status(200).send()
  })
  
  router.post('/password/code/verification', async (req, res) => {
    /*
    const code = req.params.code
    if (!code) {
      res.status(400).send("code error")
    }
    const admin = await Admin.findOne({ passwordResetToken: code })
    if (!admin) {
      res.status(400).send("not find admin")
    }
    admin.changePassword = true
    admin.passwordResetToken = undefined
    await admin.save()
    res.status(200).send()
    */
    const { verificationCode, email } = req.body
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).send("not find a user")
      }
      if(verificationCode!== user.verificationCode){
        return res.status(400).send("code is not valid")
      }
      user.changePassword = true
      user.verificationCode = undefined
      await user.save()
      res.status(200).send()
    } catch (error) {
      res.status(500).send()
    }
  })
  
  // should send email, pass, confirm pass
  router.post('/password/reset', async (req, res) => {
    const { email, password, confirmPassword } = req.body
    console.log(email, password, confirmPassword);
    const user = await User.findOne({ email })
    if (!user) {
      res.status(400).send("not find a user")
    }
    if (!user.changePassword) {
      res.status(400).send("forget req first")
    }
    if (password !== confirmPassword) {
      res.status(400).send("not matched")
    }
    user.password = password
    user.changePassword = false
    await user.save()
    res.status(200).send()
  })
  
  
  module.exports = router