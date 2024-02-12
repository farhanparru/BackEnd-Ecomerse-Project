//Schmea imported
const User = require("../models/UserSchema")
const product = require("../models/productSchema")
const Order = require('../models/orderSchema')
const { joiUserSchema } = require("../models/validationSchema")
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken") //Json Web Token Security puropsse
const {default:mongoose}= require("mongoose") //ES6 Module syntex default Commmon js 
const {json} = require('body-parser')
const  stripe = require("stripe")(process.env. STRIPE_SECRET_KEY);
console.log(process.env.STRIPE_SECRET_KEY,"hhs");
let sValue = []


 
module.exports ={
    //->new User Register
    userSignup:async(req,res)=>{
       
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

    //->user Login Jwt Web Token
     userLogin: async (req,res)=>{
       
        const {value,error} = joiUserSchema.validate(req.body) 
       
        if(error){
            res.json(error.message)
            
        }

        const {username,password} = value 
          
        const user = await User.findOne({
         
             username : username,   
          })
          console.log(user);
       
          
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
            console.log(passwordCheck);
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

           //->view product by category
           viewProduct:
           async(req,res)=>{
              const products =  await product .find()
              if(!products){
                 res.status(404).send({status:"error",message:"product note found"})
              }

            //   console.log(products);

              res.status(200).send({
                status:"succes",
                message:"Success Fully fetched data",
                data:products,
              })
           },

           //->View a specific product.
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

           // ->product by category

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
           //->User add to Cart

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

              //-> view product from a cart
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
                    // console.log(cartProductIds);
                    if(cartProductIds.length === 0){
                            return res
                            .status(200)
                            .json({status:"Succes",message:"User Cart is Emty 🛒",data:[]})
                    }

                    const cartProducts = await product.find({_id:{$in:cartProductIds}})
                    console.log(cartProducts);
                    res
                    .status(200)
                    .json({
                        status:"Success",
                        message:"Cart products fetched SuccessFully",
                        data:cartProducts
                    })
                 },
                 
                 //-> Add Product to Wish list

                 addToWishlist:async(req,res)=>{
                  //Extracting User ID from Request Parameters:
                     const userId = req.params.id;
                     if(!userId){
                         return res
                         .status(404)
                         .json({status:"Failer",message:"User Note Found"})
                     }
                     console.log(userId);
                       //Extracting Product ID from Request Body:
                     const {productId} = req.body;
                 
                     const  products = await product.findById(productId)
                   
                     if(!products){
                        return res
                        .status(404)
                         .json({message:"Product note found"})                        
                     }
                     
                     //It then checks if the user already has the specified product in their wishlist by querying the User model
                     const findproducts = await User.findOne({_id:userId,wishlist:productId})
                    //  console.log(findproducts);
                     if(findproducts){
                      return res
                      .status(409)
                      .json({message:"Product already on Your wishlist"})
                          
                     }
                   
                     
                     //If the product is not already in the wishlist, it updates the user document in the database by pushing the product ID into the wishlist array.
                     await User.updateOne({_id:userId},{$push:{wishlist:products}})
                     res.status(201).json({
                       status:"Success",
                       message:"Product SuccesFully added to wishlist",
                     })
                 },
                 // ->Show wishlist
                 showWishlist: async(req,res)=>{
                  //Extracting User ID from Request Parameters:
                      const userId = req.params.id;
                      // console.log(userId,"swjk");
                      const user = await  User.findById(userId)
                      console.log(user);
                      if(!user){
                         return res
                         .status(404)
                         .json({status:"Failer",message:"User Note found"})
                      }
                        //It then checks if the user's wishlist is empty.
                      const wishProdId = user.wishlist;
                      console.log(wishProdId,"shjkdh");

                      if(wishProdId .length === 0){
                         return res
                         .status(200)
                         .json({status:"Success",message:"User Wishlist is Emty",data:[]})
                      }
                        //If the wishlist is not empty, it proceeds to fetch the products in the wishlist using the product IDs stored in the wishProId array.
                      const wishProducts = await product.find({_id:{$in:wishProdId}})
                      
                      
                            res
                            .status(200)
                            .json({
                              status:"Success",
                              message:"Wishlist products fetched SuccessFully",
                              date:wishProducts ,
                            })
                     
                        },

                        //-> delete wishlist products

                        deleteWishlist:async (req,res)=>{
                          //Extracting User ID and Product ID from Request:
                            const userId= req.params.id
                            const {productId} = req.body;   
                            if(!productId){
                               return res.status(404).json({message:"Product note found"})
                            }  
                            
                            const user = await User.findById(userId);
                            
                             if(!user){
                               return res
                               .status(404)
                               .json({status:"Failer",message:"User Note Found"})
                             }
                              //It proceeds to update the user document in the database, using $pull to remove the specified product ID from the wishlist array.
                             await User.updateOne({_id:userId},{$pull:{wishlist:productId}})
                             res.status(200).json({status:"Successfully removed from wishlist"})
                        },

                          //-> Payments user purchase
                      payment: async (req,res)=>{
                          const userId = req.params.id;
                          // Finding the user with the given ID and populating their cart items
                          const user = await User.findOne({_id: userId}).populate('cart')
                          
                          
                          if(!user){
                               return res.status(404).json({message: "User Note Found"})
                          }
                          // Extracting cart items from the user object
                              const cartProducts = user.cart;
                             // If the user's cart is empty, return success with an empty array
                               if(cartProducts.lenght === 0){
                                 return res
                                 .status(200)
                                 .json({status:"Success",message:"User Cart Is Emty",data:[]})
                               }      
                                 // Mapping cart items to line items required for Stripe payment session
                               const  lineItems =  cartProducts.map((item)=>{
                               
                                    return {
                                      price_data:{
                                      currency:"inr",
                                      product_data:{
                                      name: item.title,
                                      description:item.description
                                      },
                                      unit_amount:Math.round(item.price * 100)
                                      },
                                      quantity: 1,
                                    };
                                 }) ;
                               
                              // Creating Payment Session with Stripe using line items
                                const  session = await stripe.checkout.sessions.create({
                           
                                    payment_method_types:['card'],
                                    line_items: lineItems,
                                    mode: "payment",
                                    success_url:`http://localhost:3000/api/users/payment/success`,//Replace with your success URL
                                    cancel_url:"http://localhost:3000/api/users/payment/cansel"//replace with your cancel url

                                 });
                                 console.log(session,"sio");

                                 if(!session){
                                   return res.json({
                                     status:"Failure",
                                     message:"Error occured on session side",
                                   })
                                 }
                                  //sValue is an object used to store relevant information about the payment session and the user initiating the payment(Storing Session Data in sValue)
                                 sValue ={
                                   userId,
                                   user,
                                   session,
                                 };
                                //  console.log(sValue,"si");

                                 res.status(200).json({    
                                   status:"Success",
                                   message:"Stripe payment session created",
                                   url:session.url,
                                 })
                            } ,
                           
                            success: async (req,res)=>{
                             
                               // Destructuring values from the stored session data (sValue)
                                const{id,user,session} = sValue;
                                    
                                // Extracting the user's unique identifier
                                const  userId = user._id;
                               
                                  // Extracting the cart items from the user object
                                const cartItems = user.cart;
                                  // Creating an order using the cart items and session details
                                const orders = await Order.create({
                                 
                                   userId: id,
                                   products:cartItems.map(
                                    (value) => new mongoose.Types.ObjectId(value._id)
                                   ),
                                   
                                   order_id:session.id,
                                  // Generates a unique payment_id for the order by concatenating "demo" with the current timestamp
                                  payment_id: `demo ${Date.now()}`,
                                   // Calculates the total amount of the order by dividing the session amount_total by 100 (assuming the amount_total is in cents)
                                   total_amount:session.amount_total/100,

                  
                                });
                                console.log(orders,"uie");

                                if(!orders){
                                    return res.json({message:"error occured whil inputing to orderDB"})
                                }
                              // Updating the user document in the database
                                const orderId = orders._id;
                                const userUpdate = await User.updateOne(
                                   {_id:userId},
                                   {
                                    $push:{orders:orderId}, // Orders the pushing after successful payment
                                    $set:{cart:[]},// Clearing the cart after successful payment
                                   },
                                   {new:true}
                                )
                             // Checking if user update was successful and sending the appropriate response
                                if(userUpdate){
                                   res.status(200).json({
                                     status:"Success",
                                     message:"Payment Successfuly"
                                   })
                                }else{
                                  res.status(500).json({
                                     status:"Success",
                                     message:"Failed to update user data"
                                  })
                                }
                            },

                            //-> Order Canseling


                            Cancel:async(req,res)=>{
                                 res.status(200).json({
                                   status:"succes",
                                   message:"Payment canceled"
                                 })
                            },
                             

                        //-> Order Deteials
                       orderDetails:async (req,res)=>{
                          const userId = req.params.id;
                          //method is used to automatically replace the orders field in the user document with actual order documents
                          const user = await User.findById(userId).populate('orders')

                          if(!user){
                             return res.status(404).json({
                               status: 'Failure',
                               message:'User Note Found'
                             })
                          }
                          const ordProduucts = user.orders;

                          if(ordProduucts.lenght === 0){
                              return res.status(200).json({
                                 message: "You don't have any product orders",
                                 data:[],
                              })
                          }

                          const orderWithProducts = await Order.find({_id:{$in: ordProduucts}})
                          .populate('products')
                          
                          res.status(200).json({
                             message:"Ordered Products Details Found",
                             data:orderWithProducts,
                       })
                      }
                  } ;