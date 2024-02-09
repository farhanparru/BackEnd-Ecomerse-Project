const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
//middlware
const tryCatchMiddleware = require("../middlewares/tryCatchMiddleware")
const verifyToken = require("../middlewares/userAuthMiddleware")


router
.post("/signup",tryCatchMiddleware(userController.userSignup))
.post("/login",tryCatchMiddleware(userController.userLogin))
.use(verifyToken)
.get("/products",tryCatchMiddleware(userController.viewProduct))
.get("/products:id",tryCatchMiddleware(userController.productById))
.get("/products/category:categoryname",tryCatchMiddleware(userController.productsByCatogery))

.post("/:id/cart",tryCatchMiddleware(userController.addToCart))
.get("/:id/cart",tryCatchMiddleware(userController.viewCartProduct))
.post("/:id/wishlists",tryCatchMiddleware(userController.addToWishlist))
.get("/:id/wishlists",tryCatchMiddleware(userController.showWishlist))
.delete("/:id/wishlists",tryCatchMiddleware(userController.deleteWishlist))
.get("/:id/orders",tryCatchMiddleware(userController.orderDetails))
module.exports = router
