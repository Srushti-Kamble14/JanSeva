import dotenv from "dotenv"
dotenv.config();
import app from "./app.js";
import authRoutes from "./routes/auth.routes.js"

const PORT = process.env.PORT || 5000;

app.use("/api/users", authRoutes);

app.get("/", (req, res) => {
  res.send("Helloo world");
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});