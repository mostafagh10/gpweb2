
const mongoose = require('mongoose')
const validator = require('validator')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'first name is required!'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'last name is required!'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'email is required!'],
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('email is not valid!')
            }
        },
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'password is required!'],
        minlength: 6
    },
    isInfected:{
        type: Boolean,
        default: false
    },
    /*
    metUnInfectedUsers: [{ // Array of users
        unInfectedUserID:{
            type: mongoose.Schema.Types.ObjectId,
            unique: true // to remove redundancy and if i face him again, i will update the time of updatedAt
            // i think it will be a CB fun, if it's unique i will update updateAr
        },
        createdAt: {
            type: Date,
            default: new Date().toLocaleString()
        },
        updatedAt: {
            type: Date,
            default: new Date().toLocaleString()
        }
    }],
    */
    city: {
        type: String,
        required: [true, 'city is required!'],
        trim: true
    },
    street: {
        type: String,
        required: [true, 'street is required!'],
        trim: true
    },
    age:{
        type: Number,
        required: [true, 'age is required!']
    },
    phoneNo:{
        type: String,
        required: [true, 'phone number is required!'],
        trim: true
    },
    notifications:[{
    /**
    * Notification is work when i find an infected one or when i met uninfected and become infected
    * Notification is for one user
    */
        notification:{
            title: {
                type: String,
                required: [true, 'title is required!'],
                trim: true
            },
            message: {
                type: String,
                required: [true, 'message is required!'],
                trim: true
            },
            icon: {
                type: String,
                required: [true, 'icon is required!']
            },
            date: {
                type: Date,
                default: new Date().toLocaleString()
            },
            required: false,
            select: false
        }
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    changePassword: { // when reset pass it will be true, otherwise will be false
      type: Boolean,
      default: false
    },
    verificationCode:{
      type: String,
      default: undefined,
    },
}, {
    timestamps: true
});


// to hide some information
userSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()

    delete userObj.tokens
    delete userObj.password
    delete userObj.notifications

    return userObj
}

// generate authentication token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const signatureToken = process.env.USER_TOKEN || 'thisismytokensignatureforUSER'
    const token = JWT.sign({ _id: user._id.toString() }, signatureToken)
    user.tokens = [...user.tokens, { token }]
    await user.save()
    return token
}

// to find the user by using his credentials
userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await userModel.findOne({ email })
    if(!user){
        throw new Error('Unable to login!')
    }
    const isMatched = await bcrypt.compare(password , user.password)
    if(!isMatched) {
        throw new Error('Unable to login ... password is incorrect!')
    }
    return user
}

// convert the plain password into the hashed password
userSchema.pre('save', async function (next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


const userModel = mongoose.model('User', userSchema);
module.exports = userModel