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
    githubUsername: {
        type: String,
        trim: true
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
    role: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    experienceLevel: {
        type: String,
        enum: ['Junior', 'Mid-level', 'Senior', 'Expert'],
        default: 'Junior'
    },
    availabilityStatus: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Weekends'],
        default: 'Part-time'
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
