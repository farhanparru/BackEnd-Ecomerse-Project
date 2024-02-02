require("dotenv").config()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const UserSchema = require("../models/UserSchema");
const productSchema = require("../models/productSchema");
const { joiProductSchema } = require("../models/validationSchema");


module.exports={
    //->admin login

    login: async(req,res)=>{
        const {email,password} = req.body;
        console.log(req.body,'ggg')
    
        if(
            email === process.env.ADMIN_EMAIL  &&
            password === process.env.ADMIN_PASSWORD
        ) {
          
             //impliment Jwt Token admin login
            const token = jwt.sign(
                {email: email},
                process.env.ADMIN_ACCESS_TOKEN_SECRET
            ); 
            console.log(token,"fal");
            return res.status(200).send({
                status:"Succes",
                message:"Admin register Succes Fully 🙌 🎉",
                data:token,
            })
          }else{
            return res.status(404).json({
                status:"Error",
                message:"This is No admin 🧐"
            })
          }
       },

       //->finding all users  

       allUsers: async(req,res)=>{
          const allUsers = await UserSchema.find()
          console.log(allUsers); 
           if(allUsers.length === 0){
             return res.status(404).json({
                status:"Error",
                message:"Users not Found 🤔🧐🤨❓❔ "
             })
           }
           res.status(200).json({
             status:"SuccesFully",
             message:"SuccesFuly fetched user data ✅",
             data: allUsers,
           });
         },
      //->View a specific user details by id

      useById: async (req,res)=>{
         const userId = req.params.id;
         const user = await UserSchema.findById(userId)
         console.log(user);
         if(!user){
            return res.status(404),json({
                status:"error",
                message:"User note Found 4️⃣0️⃣4️⃣"
            })
         }
          res.status(200).send({
            status:"Succes",
            message:"SuccesFuly find user",
            data:user,
          })
      },

      //->Create Product

      creatProduct: async (req, res) => {
        // console.log(req.body);  

        // const { value, error } = joiProductSchema.validate(req.body);
        // const { title, description, price, image, category } = value;
        // console.log(value);
        // if (error) {
        //   return res.status(404).json({ error: error.details[0].message });
        //   //    return res.send(error.message)
        // } else {
        //   await products.create({
        //     title,
        //     description,
        //     price,
        //     image,
        //     category,
        //   });
    
        //   res.status(201).json({
        //     status: "success",
        //     message: "Successfully Created products .",
        //     data: products,
        //   });
        // }

       
          const {title,description,price,image,category} = req.body ;
              //  console.log(req.body);
          const data = await productSchema.create ({
            title ,
            description,
            price,
            image,
            category,
         });
         console.log(price);
         
         res.status(201).json({
          status : "success",
          message : "product successfully created",
          data:data

         })
      },

      //->view all the products by category
      allProducts: async (req,res)=>{
         const prods = await productSchema.find()
         console.log(prods); 
           if(!prods){
             return(
               res.status(404),
               send({
                status:"error",
                message:"Products not found"
               })
             )
           }
           res.status(200).json({
             status:"success",
             message:"Succesfully fetched products detail",
             data:prods
           })
        },

        //->View a specific product.

        productsById:async (req,res)=>{
           const producId = req.params.id;
           const product = await productSchema.findById(producId)
           if(!product){
              return res.status(404).send({
                 status:"error",
                 message:"Product note found",
              })
           }

           res.status(200).json({
             status:"success",
             message:"Successfully fetched product details",
             data:product,
           })
        },

        //-> Delete Producte

        delteProduct: async (req,res)=>{
          const{productId} = req.body

          if(!productId || !mongoose.Types.ObjectId.isValid(productId)){
              return res.status(400).json({
                status:"failure",
                message:"Invalid productId provided"
              })
          }

          const deleteProduct = await productSchema.findOneAndDelete({_id:productId})
          // console.log(deleteProduct);
          if(!deleteProduct){
              return res.status(404).json({
                status:"failure",
                message:"product not found in the database"
              })
          }
             return res.status(200).json({
               status:"Success",
               message:"Producte deleted SuccessFully"
             })

        },

         //-> Admin Update Producte

         updateProduct: async (req,res)=>{
          const {value,error} = joiProductSchema.validate(req.body);
          console.log(value);

          if(error){
             return res.status(401).send({message:error.details[0].message})
          }
          const {id,title,description,price,image,category}=value
          

          const product = await  productSchema.find()
           console.log(product);
          if(!product){
            return res
            .send(404)
            .json({status:"Failer",message:"Producte not found in database"})
          }

          await productSchema.findByIdAndUpdate(
            {_id:id},
            {
              title,
              description,
              price,
              image,
              category,
            }
          );

          res
          .status(201)
          .json({status:"Success",message:"Product success fully update"})


      }

    }

      
