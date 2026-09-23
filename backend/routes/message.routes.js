const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { protect } = require('../middleware/auth');

router.get('/:otherUserId', protect, messageController.getConversation);
router.post('/', protect, messageController.sendMessage);

module.exports = router;
