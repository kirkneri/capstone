const mongoose = require('mongoose');

const ApplicantsSchema = new mongoose.Schema({
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
    phone:{
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
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
        required: true
    },
    steam: {
        type: String,
        required: true
    },
    riot: {
        type: String,
        required: true
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
        required: true
    },
    bio: {
        type: String,
        required: true  
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    goal: {
        type: String,
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

const Applicant = mongoose.model('Applicant', ApplicantsSchema);

module.exports = Applicant;