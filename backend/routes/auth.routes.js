import express from "express"
import { registerUser , loginUser,setProfile,getProfile } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser);
router.post("/profile",verifyJWT,setProfile);
router.get("/profile",verifyJWT,getProfile);

export default router
