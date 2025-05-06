const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },    
    phone: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('users', UsersSchema)