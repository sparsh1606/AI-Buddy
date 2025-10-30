const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    role:{
        type: String,
        enum: ["user", "model"],
        required: true
    },
    content:{
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    }
});

const ThreadSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: "New Chat"
    },
    messages: [MessageSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const Thread = mongoose.model("Thread", ThreadSchema);

module.exports = Thread;