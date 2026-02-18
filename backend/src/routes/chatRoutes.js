const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create or access a one-on-one chat
// @route   POST /api/chat
// @access  Private
router.post('/', protect, async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'UserId param not sent with request' });
    }

    var isChat = await Chat.find({
        $and: [
            { participants: { $elemMatch: { $eq: req.user._id } } },
            { participants: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate('participants', '-passwordHash')
        .populate('lastMessage');

    isChat = await User.populate(isChat, {
        path: 'lastMessage.sender',
        select: 'name email avatar',
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: 'sender',
            participants: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                'participants',
                '-passwordHash'
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

// @desc    Fetch all chats for a user
// @route   GET /api/chat
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        Chat.find({ participants: { $elemMatch: { $eq: req.user._id } } })
            .populate('participants', '-passwordHash')
            .populate('lastMessage')
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: 'lastMessage.sender',
                    select: 'name email avatar',
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = router;
