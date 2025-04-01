const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { getResponse } = require('../chatbot/model');

const router = express.Router();

const ChatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    botReply: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', ChatSchema);

function authMiddleware(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const tokenParts = token.split(' ');
        if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
            return res.status(401).json({ error: "Invalid token format." });
        }

        const verified = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
        req.userId = verified.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
}

// Store User Message & AI Response
router.post('/', authMiddleware, async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) return res.status(400).json({ error: "Message cannot be empty." });

        const botReply = await getResponse(userMessage);
        if (!botReply) return res.status(500).json({ error: "Failed to generate a response." });

        const chat = new Chat({ userId: req.userId, message: userMessage, botReply });
        await chat.save();

        res.json({ reply: botReply });
    } catch (err) {
        console.error("❌ Chatbot Error:", err);
        res.status(500).json({ error: "Internal server error. Please try again." });
    }
});

// Fetch Chat History
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const history = await Chat.find({ userId: req.userId }).sort({ timestamp: 1 });

        if (!history.length) {
            return res.json([]);
        }

        res.json(history.map(chat => ({
            user: chat.message,
            bot: chat.botReply,
            timestamp: chat.timestamp
        })));
    } catch (err) {
        console.error("❌ Chat History Error:", err);
        res.status(500).json({ error: "Could not fetch chat history." });
    }
});
// DELETE Chat History
router.delete('/history', authMiddleware, async (req, res) => {
    try {
        await Chat.deleteMany({ userId: req.userId }); // Remove all user messages
        res.json({ message: "Chat history deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete chat history' });
    }
});


module.exports = router;
