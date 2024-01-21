const express = require('express');

const authRouter = express.Router();

const { registerUser, login, registerAdmin } = require('../controllers/authController');

const newUserMiddleware = require('../middlewares/newUserMiddleware');
const adminTokenValidation = require('../middlewares/adminTokenValidation')


authRouter.post('/register', newUserMiddleware, registerUser )
authRouter.post('/login', login)

authRouter.post('/Adminregister', adminTokenValidation, newUserMiddleware, registerAdmin)

module.exports = authRouter;