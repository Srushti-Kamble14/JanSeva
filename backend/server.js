// import dotenv from "dotenv"
// dotenv.config();
// import app from "./app.js";
// import authRoutes from "./routes/auth.routes.js"
// import schemesRoutes from "./routes/schemes.routes.js"
// console.log("SERVER FILE LOADED");
// const PORT = process.env.PORT || 5000;

// app.use("/api/users", authRoutes);
// app.use("/api/schemes",schemesRoutes);

// app.get("/", (req, res) => {
//   res.send("Helloo world");
// });

// app.get("/api/test", (req, res) => {
//   res.send("test works");
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port http://localhost:${PORT}`);
// });

// import dotenv from "dotenv";
// dotenv.config();

// import app from "./app.js";

// const PORT = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//   res.send("HOME WORKING");
// });

// app.get("/api/test", (req, res) => {
//   res.json({
//     success: true,
//     message: "TEST WORKING",
//   });
// });

// app.router.stack.forEach((layer) => {
//   if (layer.route) {
//     console.log("ROUTE:", layer.route.path);
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on ${PORT}`);
// });

import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import authRoutes from "./routes/auth.routes.js";
import schemesRoutes from "./routes/schemes.routes.js";

console.log("authRoutes:", authRoutes);
console.log("schemesRoutes:", schemesRoutes);

app.use("/api/users", authRoutes);
app.use("/api/schemes", schemesRoutes);

app.listen(5000, () => {
  console.log("Server running on 5000");
});