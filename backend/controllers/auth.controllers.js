import prisma from "../config/prisma.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



export const registerUser = async(req,res)=>{
    try {
        
        const {fullName,email,password} = req.body;

        if(!fullName || !email || !password){
            return res.status(400).json({message :"All fields are required"})
        }

        const existedUser = await prisma.user.findUnique({
            where:{email},
        })

        if(existedUser) return res.status(400).json({message : "user already exists"})

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await prisma.user.create({
            data:{
                fullName,
                email,
                password:hashedPassword,
            }
        })



        res.status(201).json({
            message : "User created successfully",
            user : {
                id:user.id,
                fullName:user.fullName,
                email:user.email
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Something went wrong while creating user",error: error.message})
    }
}


export const loginUser = async(req,res)=>{
   try {
     const {email,password}=req.body;
 
     if(!email || !password) return res.status(400).json({message:"All fields are required"});
 
     const user = await prisma.user.findUnique({where : {email}});
 
     if(!user) return res.status(400).json({message:"User does not exist"});
 
     //check is password correct
     const isPasswordValid = await bcrypt.compare(password,user.password);

     if(!isPasswordValid)  return res.status(400).json({message:"Invalid credentials"});
 
     //generate refresh and access token
     const accessToken = jwt.sign(
        {
            id:user.id,
            email:user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:  process.env.ACCESS_TOKEN_EXPIRY,
        }
     )

     const refreshToken = jwt.sign(
        {
            id:user.id,
          
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:  process.env.REFRESH_TOKEN_EXPIRY,
        }
     )
 
     //save refresh token into db

     await prisma.user.update({
        where : {id:user.id},
        data:{
            refreshToken
        }
     })

     //remove sesitive fields
     const {password: _ , refreshToken:__,...safeUser} = user;
 
     //return res

     return res.status(200).json({
        success:true,
        message:"User login successfully" ,
        accessToken,
        refreshToken,
        user:safeUser,
     })

   } catch (error) {
    return res.status(500).json({message:"User login failed" , error:error.message})
   }
}
