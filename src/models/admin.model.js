
const mongoose  = require('mongoose')
const validator = require('validator')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const adminSchema = mongoose.Schema({
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
    email:{
        type: String,
        required: [true, 'email is required!'],
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error('email is not valid!')
            }
        },
        unique: true
    },
    password:{
        type: String,
        required: [true, 'password is required!'],
        minlength: 6
    },
    tokens:[{
        token:{
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
},{
    timestamps: true
});

// to hide some inforamtion
adminSchema.methods.toJSON = function(){
    const admin = this
    const adminObj = admin.toObject()

    //delete adminObj.password
    delete adminObj.tokens

    return adminObj
}

// generate authentication token
adminSchema.methods.generateAuth = async function(){
    const admin = this
    const signatureToken = process.env.ADMIN_TOKEN || 'thisismytokensignatureforADMIN'
    const token = JWT.sign({ _id: admin._id.toString() }, signatureToken)
    admin.tokens = [...admin.tokens, { token }]
    await admin.save()
    return token
}

// to find the user by using his credentials
adminSchema.statics.findByCredentials = async (email, password)=> {
    const admin = await adminModel.findOne({ email })
    if(!admin){
        throw new Error('Unable to login!')
    }
    const isMatched = await bcrypt.compare(password, admin.password)
    if (!isMatched) {
        throw new Error('Unable to login!')
    }
    return admin
}

// convert the plain password into the hashed password
adminSchema.pre('save', async function (next) {
    const admin = this
    if(admin.isModified('password')){
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next()
})

const adminModel = mongoose.model('Admin', adminSchema);
module.exports = adminModel