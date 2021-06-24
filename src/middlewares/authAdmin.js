const Admin = require('../models/admin.model')
const JWT = require('jsonwebtoken')
const signatureToken = process.env.ADMIN_TOKEN || 'thisismytokensignatureforADMIN'

const auth = async (req, res, next) => {
    //const token  = req.header('Authorization').replace('Bearer ', '')
    const token = req.body.token
    const decode = JWT.verify(token, signatureToken)
    if(!decode){
        throw new Error('you not have a valid token')
    }
    const admin = await Admin.findOne({ _id: decode._id, 'tokens.token': token })
    if(!admin){
        throw new Error('you aren\'t an admin')
    }
    req.admin = admin
    req.token = token
    next()
}

module.exports = auth