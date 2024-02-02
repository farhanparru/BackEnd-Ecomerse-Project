const express = require("express")
const router = express.Router() 
const admin = require("../controller/adminController")

//Middleware
const tryCatchMiddleware = require("../middlewares/tryCatchMiddleware")
const verifyToken = require("../middlewares/adminAuthMiddleware")
const imageUpload = require("../middlewares/imageUpload/imageUpload")
router.use(express.json())

router
.post("/login",tryCatchMiddleware(admin.login))

// apk middleware  start

// .use(verifyToken)

// apk middleware  end


.get("/users",tryCatchMiddleware(admin.allUsers))
.get("/user/:id",tryCatchMiddleware(admin.useById))
.post("/products",imageUpload, tryCatchMiddleware(admin.creatProduct))
.get("/products",tryCatchMiddleware(admin.allProducts))
.get("/products:id",tryCatchMiddleware(admin.productsById))
.delete("/products",tryCatchMiddleware(admin.delteProduct))
.put("/products",tryCatchMiddleware(admin.updateProduct))


module.exports = router 