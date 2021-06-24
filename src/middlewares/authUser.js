
const JWT = require('jsonwebtoken')
const User = require('../models/user.model')
const signatureToken = process.env.USER_TOKEN || 'thisismytokensignatureforUSER'

const auth = async(req, res, next)=>{
    //const token = req.header('Authorization').replace('Bearer ', '')
    const token = req.body.token
    const decode = JWT.verify(token, signatureToken)
    if(!decode){
        throw new Error('you not have a valid token')
    }
    const user = await User.findOne({_id: decode._id, 'tokens.token': token})
    if(!user){
        throw new Error('you aren\'t an user')
    }
    req.user = user
    req.token  = token
    next()
}

module.exports = auth