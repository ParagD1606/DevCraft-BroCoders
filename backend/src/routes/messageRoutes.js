const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');
const { protect } = require('../middleware/authMiddleware');

// @desc    Send a message
// @route   POST /api/message
// @access  Private
router.post('/', protect, async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log('Invalid data passed into request');
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate('sender', 'name avatar');
        message = await message.populate('chat');
        message = await User.populate(message, {
            path: 'chat.participants',
            select: 'name email avatar',
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            lastMessage: message,
        });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// @desc    Fetch all messages for a chat
// @route   GET /api/message/:chatId
// @access  Private
router.get('/:chatId', protect, async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', 'name avatar email')
            .populate('chat');

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = router;
