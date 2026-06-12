import express from "express"
import { getAllSchemes,getSchemeById } from "../controllers/schemes.controllers.js";
// console.log("schemes.routes.js loaded");
const router = express.Router();

router.get("/",getAllSchemes);
router.get("/:id", getSchemeById);
export default router

