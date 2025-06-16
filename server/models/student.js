const mongoose = require('mongoose');

    const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    codeforcesHandle: {
        type: String,
        required: true,
        trim: true
    },
    currentRating: {
        type: Number,
        default: 0
    },
    maxRating: {
        type: Number,
        default: 0
    },
    emailRemindersEnabled: {
        type: Boolean,
        default: true
    },
    
    // NEW: Comprehensive Codeforces data storage
    contestHistory: [{
        id: Number,
        name: String,
        date: String,
        rank: Number,
        oldRating: Number,
        newRating: Number,
        ratingChange: Number
    }],
    
    ratingHistory: [{
        date: String,
        rating: Number
    }],
    
    problemStats: {
        totalSolved: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
        averagePerDay: { type: Number, default: 0 },
        mostDifficultProblem: {
        name: String,
        rating: Number,
        url: String
        },
        ratingDistribution: [{
        range: String,
        count: Number
        }],
        submissionHeatmap: [{
        date: String,
        count: Number
        }]
    },
    
    // Sync and reminder tracking
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    lastSyncTime: {
        type: Date,
        default: null
    },
    reminderEmailCount: {
        type: Number,
        default: 0
    },
    lastReminderSent: {
        type: Date,
        default: null
    }
    }, {
    timestamps: true
    });

// Index for efficient queries
studentSchema.index({ codeforcesHandle: 1 });
studentSchema.index({ lastSyncTime: 1 });
studentSchema.index({ emailRemindersEnabled: 1 });

module.exports = mongoose.model('Student', studentSchema);