
const router = require('express').Router()
const authUser = require('../middlewares/authUser')
const authAdmin = require('../middlewares/authAdmin')
const User = require('../models/user.model')
const { generateToken } = require('../Utils/helpers')
const { sendPasswordVerificationCode } = require('../emails/mailer')

const {
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
} = require('../controllers/user.controller')

// to get all users 
router.get('/', /* authAdmin, */ getUsers)

router
    .route('/:id')
    .get(/* authAdmin, */ getUserByAdmin)
    .patch(/* authAdmin, */ editUserByAdmin)
    .delete(/*authAdmin, */ deleteUserByAdmin);

router
    .route('/me')
    .post(authUser, getUser)
    .patch(authUser, editUser)
    .delete(authUser, deleteUser);

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', authUser, logout)

router.post('/logout-all', authUser, logoutFromAllDevices)

// add infected patient
router.post('/infected', /*authAdmin,*/ addInfectedPatient)




// id for the user
// authAdmin or authUser ?
router.delete('/uninfected/clear-table/:id', authAdmin, clearUnInfectedTable)

// check the uninfected users within a day
router.get('/uninfected/check-withinday', authUser, checkWithinDay)

// update the status of uninfected users
router.patch('/uninfected/updatethestatus', authUser, updateTheStatusOfUnInfectedUsers)

router.post('/uninfected/add', authUser, addUnInfectedUser)


// password forget
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
      sendPasswordVerificationCode(user.email, user.firstName, 'client', user.verificationCode)
    } else {
    user.verificationCode= await generateToken(4)
    sendPasswordVerificationCode(user.email, user.firstName, 'client', user.verificationCode )
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
        return res.status(400).send("not find an user")
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
      res.status(400).send("not find an user")
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



