const express = require('express');
const protectedPath = require('../middleware/authMiddleware');
const router = express.Router();
const { sendMessage, allMessages } = require('../controllers/message');

router.route('/').post(protectedPath, sendMessage);
router.route('/:chatId').get(protectedPath, allMessages);

module.exports = router;
