const express = require('express');

const authRouter = express.Router();

const { registerUser } = require('../controllers/authController');

const newUserMiddleware = require('../middlewares/newUserMiddleware');


authRouter.post('/register', newUserMiddleware, registerUser )
authRouter.post('/login')

module.exports = authRouter;