const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true  
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: null,
    },
    gamertag: {
        type: String,
        required: true
    },
    games: {
        type: [String],
        required: true,
    },
    discord: {
        type: String,
        required: false
    },
    steam: {
        type: String,
        required: false
    },
    riot: {
        type: String,
        required: false
    },
    instagram: {
        type: String,
        required: false  
    },
    youtube: {
        type: String,
        required: false  
    },
    rank: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;