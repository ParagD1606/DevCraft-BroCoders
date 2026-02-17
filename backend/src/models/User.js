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
            // Password is required only if githubId is not present
            return !this.githubId;
        }
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple documents to have no githubId (null/undefined)
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
