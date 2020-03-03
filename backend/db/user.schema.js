var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 999
    },
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 999
    },
    image: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: false,
        minlength: 5,
        maxlength: 999
    },
    isVerified: {
        type: Boolean,
        required: false,
    },
    isLeaved: {
        type: Boolean,
        required: false,
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
