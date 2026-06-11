import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("TEST SERVER");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "HELLO SRUSHTI"
  });
});

app.listen(5000, () => {
  console.log("TEST SERVER RUNNING");
});