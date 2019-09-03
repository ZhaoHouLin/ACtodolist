const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/todo", { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error!");
});

// 連線成功
db.once("open", () => {
  console.log("mongodb connected!");
});

const Todo = require("./models/todo.js");

app.get("/", (req, res) => {
  res.send("Success");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
