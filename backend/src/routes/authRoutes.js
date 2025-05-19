const express = require('express');
const router = express.Router();
const { register, login, googleLogin, changePassword } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/change-password', auth, changePassword);

module.exports = router; 