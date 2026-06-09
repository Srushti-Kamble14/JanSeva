import express from "express"
import { registerUser , loginUser,setProfile } from "../controllers/auth.controllers.js";
import { verifyJWT } from "./auth.middlewares.js";
const router = express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser);
router.post("/profile",verifyJWT,setProfile);

export default router
