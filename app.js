require("dotenv").config();
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 3000;
const userRouter = require('./router/userRouter')
const ErrorHandler = require('./middlewares/ErrorHandler')
const bodyParser = require('body-parser')
const adminRoute = require("./router/adminRouter") 
//data base connection
mongoose.connect("mongodb://127.0.0.1:27017/E-Commerse",{
     useNewUrlParser:true,
     useUnifiedTopology:true,
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.json())

app.use("/api/users",userRouter)
app.use("/api/admin",adminRoute) 

app.use(ErrorHandler)

app.get('/', (req, res) => {
    res.send("Hello Back End");
});

app.listen(PORT,()=>{
    console.log('Server is Runing port on 3000');
})
   