const express = require('express');
const router = express.Router();
const { xyz, signup,login,logout,me,refresh,verifyEmail,resendVerificationEmail,forgotPassword,resetPassword,verifyResetToken } = require('../controllers/authController');
const { body } = require("express-validator");
const {authenticateUser} = require("../middleware")



const signupValidation = [
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("username must be at least 3 charactes Long!"),
    body("email").isEmail().withMessage("email is not valid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage(" password must be at least 6 characters Long! "),
  ];
router.get('/',xyz)


router.post('/signup',signupValidation, signup);
router.post('/login', login);
router.post('/logout',authenticateUser, logout);
router.post('/refresh', refresh);
router.get('/me',authenticateUser, me);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification-email', resendVerificationEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-reset-token/:token',verifyResetToken);




module.exports = router;
