import { exec } from "child_process";
import path from "path";
import { voiceMap } from "../utils/voiceMap.js";
import fs from "fs";
export const generateSpeech = async (req, res) => {
  console.log("TTS ROUTE HIT");
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const filename = `speech-${Date.now()}.mp3`;

    const outputPath = path.join(
      process.cwd(),
      "public",
      "audio",
      filename
    );
// console.log("process.cwd():", process.cwd());
// console.log("outputPath:", outputPath);
  const voice =
  voiceMap[language] ||
  voiceMap.en;

const tempJson = path.join(
  process.cwd(),
  `tts-${Date.now()}.json`
);

fs.writeFileSync(
  tempJson,
  JSON.stringify({
    text,
    voice,
    output: outputPath,
  }),
  "utf8"
);

const pythonCmd =
  process.platform === "win32"
    ? "py"
    : "python3";

const command =
  `${pythonCmd} tts/generate.py "${tempJson}"`;
exec(command, (error, stdout, stderr) => {
   

  if (fs.existsSync(tempJson)) {
    fs.unlinkSync(tempJson);
  }

  if (error) {
    //  console.error("TTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "TTS generation failed",
    });
  }

  return res.json({
    success: true,
    audioUrl: `/audio/${filename}`,
  });
});
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};