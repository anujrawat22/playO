const express = require("express");
const { UserModel } = require("../models/user.model");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserRouter = express.Router();


UserRouter.post('/signup',async (req,res)=>{
    const { name,email, password,age } = req.body
    try{
        const findUser =await UserModel.findOne({email}) 
        if(findUser){
            return res.status(409).send({'message' : 'User already exists'})
        }else{
             bcrypt.hash(password,5,function(err,hash){
                if(err){
                   return res.status(400).send({'Error' : err})
                }else{
                    const user = new UserModel({name,password : hash,email,age})
                    user.save()
                    return res.status(201).send({'message' : 'Signup Sucessful'})
                }
             })
        }
    }catch(err){
        console.log(err)
        res.status()
    }
       
})


UserRouter.post('/login',async (req,res)=>{
    const {email,password} = req.body

    try{
       const user = await UserModel.findOne({email})
       
       if(user){
        const hashedpassword = user.password
          bcrypt.compare(password,hashedpassword,(err,result)=>{
            if(err){
                return res.status().send({'Error' : err })
            }else{
                if(result){
                  const token = jwt.sign( {UserId : user._id,username : user.name},process.env.TokenKey,{expiresIn : 60*60*24*7})
                  const refresh_token = jwt.sign({UserId : user._id,username : user.name},process.env.RefreshTokenKey,{expiresIn : 60*60*24*30})
                  return res.status(200).send({'message' : 'Login Sucessful', 'token' : token ,'refresh_token' : refresh_token, 'user_detail' : {'name' : user.name,'email' : user.email}})
                }else{
                    return res.status(401).send({"message" : "Incorrect Password"})
                }
            }
          })
       }
    }catch(err){
        console.log(err)
        return res.status(500).send({"Error" : err})
    }
})


module.exports = { UserRouter };
