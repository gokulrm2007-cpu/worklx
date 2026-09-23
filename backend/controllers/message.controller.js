const { getDBStatus } = require('../config/db');
const Message = require('../models/Message');
const User = require('../models/User');
const { mockStore } = require('../config/seed');

// @desc    Get conversation history between logged-in user and another user
// @route   GET /api/messages/:otherUserId
exports.getConversation = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user._id;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const messages = await Message.find({
        $or: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      })
        .populate('senderId', 'name profileImage role')
        .populate('receiverId', 'name profileImage role')
        .sort({ createdAt: 1 });

      return res.json({ success: true, count: messages.length, messages });
    } else {
      const messages = mockStore.messages
        .filter(
          (m) =>
            (m.senderId === currentUserId && m.receiverId === otherUserId) ||
            (m.senderId === otherUserId && m.receiverId === currentUserId)
        )
        .map((m) => {
          const sender = typeof m.senderId === 'object' ? m.senderId : mockStore.users.find((u) => u._id === m.senderId);
          const receiver = typeof m.receiverId === 'object' ? m.receiverId : mockStore.users.find((u) => u._id === m.receiverId);
          return {
            ...m,
            senderId: sender || { name: 'User' },
            receiverId: receiver || { name: 'User' },
          };
        });

      return res.json({ success: true, count: messages.length, messages });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/messages
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, bookingId, message } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ success: false, message: 'Please provide receiver and message content' });
    }

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const newMsg = await Message.create({
        senderId: req.user._id,
        receiverId,
        bookingId: bookingId || null,
        message,
        read: false,
      });

      const populated = await Message.findById(newMsg._id)
        .populate('senderId', 'name profileImage role')
        .populate('receiverId', 'name profileImage role');

      return res.status(201).json({ success: true, message: populated });
    } else {
      const newMsg = {
        _id: `msg_${Date.now()}`,
        senderId: req.user._id,
        receiverId,
        bookingId: bookingId || null,
        message,
        read: false,
        createdAt: new Date(),
      };

      mockStore.messages.push(newMsg);

      const sender = mockStore.users.find((u) => u._id === req.user._id);
      const receiver = mockStore.users.find((u) => u._id === receiverId);

      return res.status(201).json({
        success: true,
        message: {
          ...newMsg,
          senderId: sender || { name: 'Sender' },
          receiverId: receiver || { name: 'Receiver' },
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
