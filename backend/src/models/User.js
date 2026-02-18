const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please add a valid email'
        ]
    },
    passwordHash: {
        type: String,
        required: function () {
            // Password is required only if neither githubId nor googleId is present
            return !this.githubId && !this.googleId;
        }
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple documents to have no githubId (null/undefined)
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        trim: true
    },
    age: {
        type: Number
    },
    qualifications: {
        type: String,
        trim: true
    },
    onboardingCompleted: {
        type: Boolean,
        default: false
    },
    skills: [String],
    interests: [String],
    availability: {
        type: Map,
        of: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
