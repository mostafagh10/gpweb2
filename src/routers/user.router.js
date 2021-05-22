
const router = require('express').Router()
const authUser = require('../middlewares/authUser')
const authAdmin = require('../middlewares/authAdmin')

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
router.get('/', authAdmin, getUsers)

router
    .route('/:id')
    .get(authAdmin, getUserByAdmin)
    .patch(authAdmin, editUserByAdmin)
    .delete(authAdmin, deleteUserByAdmin);

router
    .route('/me')
    .get(authUser, getUser)
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



module.exports = router



