const express = require('express');
const router = express.Router();
const userControlller = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.post('/register', userControlller.register);
router.post('/login', userControlller.login);
router.get('/get-user-data', auth.verifyJWT, userControlller.getUserData);
router.get('/get-unverified-users', auth.verifyJWT, auth.checkRole(['admin']), userControlller.getUnverifiedUsers); //admin
router.post('/account-verify', auth.verifyJWT, auth.checkRole(['admin']), userControlller.verifyUserAccount); //admin
router.get('/get-forgot-pw-otp/:email', userControlller.forgotPasswordOtp);
router.post('/reset-password', userControlller.resetPassword);

module.exports = router;