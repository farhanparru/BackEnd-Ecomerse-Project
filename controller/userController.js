//Schmea imported
const User = require("../models/UserSchema")
const product = require("../models/productSchema")
const { joiUserSchema } = require("../models/validationSchema")
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken") //Json Web Token Security puropsse
const {default:mongoose}= require("mongoose") //ES6 Module syntex default Commmon js 
const {json} = require('body-parser')




 
module.exports ={
    //new User Register
    userSignup:async(req,res)=>{
        console.log(req.body);
        const {value,error} = joiUserSchema.validate(req.body)
        const {name,email,username,password}=req.body;
        if(error){
            res.status(400).json({
                status:"Error",
                message:"Invalid user input ☹️. Please check your data. 🙂"
            })
        }
        await User.create({
            name:name,
            email:email,
            username:username,
            password:password
        })
        res.status(201).json({
            status:"Status",
            message:"User registration Succesfull😊"
        })
    },

    //user Login Jwt Web Token
     userLogin: async (req,res)=>{
       
        const {value,error} = joiUserSchema.validate(req.body) 
       
        if(error){
            res.json(error.message)
            
        }

        const {username,password} = value   
        const user = await User.findOne({
             username : username,   
          })
       
          
           if(!user){
            return res.status(404).json({
                status: "error",
                message:"User not fount 🧐"
            })
          }
        
         

          if(!password || !user.password){
              return res  
              .status(401)
              .json({error: "errore",message:"Invalid Input"})
             
          }
  
           


            const passwordCheck = await bcrypt.compare(password,user.password); 
            if(!passwordCheck){
             
                return res
                .status(401)
                .json({error:"error",message:"Incorrect password  🔐"})
            }
                const token = jwt.sign(
                    {username:user.username},
                    process.env.USER_ACCES_TOKEN_SECRET,
                    
                {

                    expiresIn:86400
                    
                }
                );
             
                res
                .status(200)
                .json({status:"succes",message:"Login SuccessFull", data: token})
           },

           //view product by category
           viewProduct:async(req,res)=>{
              const products =  await product .find()
              if(!products){
                 res.status(404).send({status:"error",message:"product note found"})
              }

              console.log(products);

              res.status(200).send({
                status:"succes",
                message:"Success Fully fetched data",
                data:products,
              })
           },

           //View a specific product.
           productById: async(req,res)=>{
             const productId = req.params.id;
             const prod = await product.findById(productId)
             console.log(prod);
             if(!prod){
                
                return res.status(404).json({ 
                    status:"error",
                    message:"Product note Found",
                })
             }
             res.status(200).json({
                status:"product fetched successfully✅",
                data:prod,
             })
           },

           // product by category

           productsByCatogery:async(req,res)=>{
             const prodCatogery= req.params.categoryname;
             console.log(prodCatogery);
             const products = await product.find({category: prodCatogery});
             if(!products){
                return res.status(404).send({
                    status:"error",
                    message:"Product note found"
                })
             }
               res.status(200).send({
                 status:"SuccessFully",
                 message:"Product Category Fetched ✅",
                 data:products,
               })
           },
           //User add to Cart

           addToCart: async(req,res)=>{
              const userId =req.params.id;
              console.log(userId);
              const user = await User.findById(userId);
            //  console.log(user);
              if(!user){
                 return res.status(404).send({
                    status:"Failer",
                    message:"User Note Found 🚫",
                 })
              }
              const productId = req.body.productId
              console.log(productId);
             //Check if productId is provided
              if(!productId){
                 return res.status(404).send({
                    status:"Failer",
                    message:"Product not fount ☹️"
                 })
              }
                   await User.updateOne({_id:userId},{$push:{cart:productId}})
                   res.status(200).json({
                     status:"success",
                     message:"Product SuccessFully added to cart"
                   })
                 },
                      // view product from a cart
                  viewCartProduct: async (req,res)=>{
                    const userId = req.params.id;
                    const user = await  User.findById(userId) 
                        // console.log(user);
                    if(!user){
                        return res
                        .status(404)
                         .json({status:"Failer",message:" User Note Found"})
                    }

                    const cartProductIds = user.cart
                    console.log(cartProductIds);
                    if(cartProductIds.length === 0){
                            return res
                            .status(200)
                            .json({status:"Succes",message:"User Cart is Emty 🛒",data:[]})
                    }

                    const cartProducts = await product.find({_id:{$in:cartProductIds}})
                    // console.log(cartProducts);
                    res
                    .status(200)
                    .json({
                        status:"Success",
                        message:"Cart products fetched SuccessFully",
                        data:cartProducts
                    })
              },

             
            }  