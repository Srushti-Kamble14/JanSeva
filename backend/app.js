import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  "/audio",
  express.static(
    path.join(process.cwd(), "public", "audio")
  )
);
// console.log(
//   path.join(process.cwd(), "public", "audio")
// );


app.get("/audio-test", (req, res) => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "audio"
  );

  res.json({
    folder: filePath,
    files: fs.readdirSync(filePath),
  });
});
export default app;