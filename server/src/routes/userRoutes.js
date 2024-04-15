const express = require('express');

const userRouter = express.Router();

const { getAllProducts, getProductById, getProductsByCategory, getProductsByBrand, searchProductsByName, recommendProductsBySkinTone, getSkintone, checkLogin, editUserDetails } = require('../controllers/userControllers');

const tokenValidateMiddleware = require("../middlewares/tokenValidateMiddleware")

userRouter.get("/products", tokenValidateMiddleware, getAllProducts);
userRouter.get("/products/:id", tokenValidateMiddleware, getProductById);
userRouter.get("/products/category/:category", tokenValidateMiddleware, getProductsByCategory);
userRouter.get("/products/brand/:brand", tokenValidateMiddleware, getProductsByBrand);
userRouter.get("/products/search/:term", tokenValidateMiddleware, searchProductsByName)
userRouter.get("/recommend", tokenValidateMiddleware, recommendProductsBySkinTone)
userRouter.post("/skin", tokenValidateMiddleware, getSkintone)
userRouter.post("/check", checkLogin);
userRouter.put("/profile", tokenValidateMiddleware, editUserDetails)

module.exports = userRouter