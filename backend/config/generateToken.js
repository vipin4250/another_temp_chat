const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = require('../config/keys');
// const mongoose = require('mongoose');
// const User = mongoose.model('User');

const generateToken = (user) => {
    return jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "30d",
    }); 
};

module.exports = { generateToken };