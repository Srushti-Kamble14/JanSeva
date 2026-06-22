import express from "express"
import { registerUser , loginUser,setProfile,getProfile } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import passport from "passport";
import { googleCallback } from "../controllers/auth.controllers.js";
const router = express.Router();

console.log("AUTH ROUTES LOADED");

router.post("/register",registerUser)
router.post("/login",loginUser);
router.post("/profile",verifyJWT,setProfile);
router.get("/profile",verifyJWT,getProfile);
router.get("/google", (req, res, next) => {
  console.log("GOOGLE ROUTE HIT");
  next();
}, passport.authenticate("google", {
  scope: ["profile", "email"],
}));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  googleCallback
);

export default router
