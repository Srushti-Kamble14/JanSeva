import express from "express";
import { generateSpeech } from "../controllers/tts.controller.js";

const router = express.Router();

router.post("/speak", generateSpeech);

export default router;