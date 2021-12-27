const express = require('express');
const router = express.Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteAllChats,
} = require('../controllers/chat');
const protectedPath = require('../middleware/authMiddleware');

router.route('/').post(protectedPath, accessChat);
router.route('/').get(protectedPath, fetchChats);
router.route('/group').post(protectedPath, createGroupChat);
router.route('/rename').put(protectedPath, renameGroup);
router.route('/groupremove').put(protectedPath, removeFromGroup);
router.route('/groupadd').put(protectedPath, addToGroup);
router.route('/delete').post(deleteAllChats);

module.exports = router;
