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

// {
//   "email" : "srushtikamble1409@gmail.com",
//   "password" : "srushti123"
// }

// {
//   "phone": "9876543210",
//   "dob": "2003-05-14T00:00:00.000Z",
//   "preferredLanguage": "ENGLISH",
//   "category": "STUDENT",
//   "state": "MAHARASHTRA",
//   "annualIncome": 1
// }

export const setProfile = async (req, res) => {
  try {
    const {
      phone,
      dob,
      preferredLanguage,
      category,
      state,
      annualIncome,
    } = req.body;

    const data = {
      phone,
      preferredLanguage,
      category,
      state,
      userId: req.user.id,
    };

    // Handle DOB
    if (dob) {
      const parsedDate = new Date(dob);

      if (!isNaN(parsedDate.getTime())) {
        data.dob = parsedDate;
      }
    }

    // Handle annualIncome
    if (annualIncome !== undefined && annualIncome !== null) {
      if (typeof annualIncome === "string") {
        const incomeMap = {
          "Below 2.5L": 1,
          "2.5L-5L": 2,
          "5L-10L": 3,
          "Above 10L": 4,
        };

        
        if (!isNaN(Number(annualIncome))) {
          data.annualIncome = parseInt(annualIncome, 10);
        }
      } else {
        data.annualIncome = annualIncome;
      }
    }

    const profile = await prisma.profile.upsert({
      where: {
        userId: req.user.id,
      },
      update: {
        phone: data.phone,
        dob: data.dob,
        preferredLanguage: data.preferredLanguage,
        category: data.category,
        state: data.state,
        annualIncome: data.annualIncome,
      },
      create: data,
    });

    return res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      profile,
    });
  } catch (error) {
    console.log("FULL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save profile",
      error: error.message,
    });
  }
};

export const getProfile=async(req,res)=>{
  try {

    const profile = await prisma.profile.findUnique(
      {
        where : {
          userId : req.user.id,
        },
        include:{
          user:{
            select:{
              fullName:true,
              email:true,
            }
          }
        }
      }
    )


    if(!profile){
      return res.status(404).json({message:"Profile not found"})
    }

    return res.status(200).json({message:"Profile fetched successfully", success:true,profile});
    
  } catch (error) {
   return res.status(500).json({message:"Failed to fetch profile",error:error.message}); 
  }
}