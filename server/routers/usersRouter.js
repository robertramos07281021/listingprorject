const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const passport = require('passport')
const {storeReturnTo} = require('../../middlewares');

router.get('/register',usersController.registrationForm);
router.post('/register' ,usersController.saveUsers);
router.get('/login', usersController.loginForm);
router.post('/login',storeReturnTo, passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}), usersController.loginUser);
router.get('/logout', usersController.logout);

module.exports = router;