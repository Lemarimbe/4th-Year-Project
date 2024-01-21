const express = require('express');

const adminRouter =  express.Router()

const { addProducts } = require('../controllers/adminControllers')

const adminTokenValidation = require('../middlewares/adminTokenValidation')

adminRouter.post('/addProducts', adminTokenValidation, addProducts)

module.exports = adminRouter