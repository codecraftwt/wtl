const mongoose = require('mongoose')
const User=require('../../User/model/userModel')

const faqSchema = new mongoose.Schema(
    {
        uderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'owner', 'user'],
            required: true
        },

        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            enum: ['unseen','view', 'pending', 'completed'],
            default:'unseen'
        },
        category: {
            type: String,
            enum: ['general', 'technical', 'billing', 'support'],
            default: 'general'
        }
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('FAQ',faqSchema)