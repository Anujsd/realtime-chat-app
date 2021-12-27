const express = require('express');
const router = express.Router();
const { authUser, registerUser, allUsers } = require('../controllers/user');
const protectedPath = require('../middleware/authMiddleware');

router.route('/login').post(authUser);
router.route('/').post(registerUser).get(protectedPath, allUsers);

module.exports = router;
