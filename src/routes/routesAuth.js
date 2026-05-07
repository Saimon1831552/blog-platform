const express = require('express');
const { register, login, profile } = require('../controller/authController');
const auth = require('../middleware/auth');

const route = express.Router();

route.post('/register', register);
route.post('/login',    login);
route.get('/profile',   auth, profile); 

module.exports = route;