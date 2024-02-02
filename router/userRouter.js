const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
//middlware
const tryCatchMiddleware = require("../middlewares/tryCatchMiddleware")
const verifyToken = require("../middlewares/userAuthMiddleware")


router
.post("/signup",tryCatchMiddleware(userController.userSignup))
.post("/login",tryCatchMiddleware(userController.userLogin))
// .use(verifyToken)
.get("/products",tryCatchMiddleware(userController.viewProduct))
.get("/products:id",tryCatchMiddleware(userController.productById))
.get("/products/category/:categoryname",tryCatchMiddleware(userController.productsByCatogery))

.post("/:id/cart",tryCatchMiddleware(userController.addToCart))
.get("/:id/cart",tryCatchMiddleware(userController.viewCartProduct))

module.exports = router
