const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

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

// 設定路由
// Todo 首頁
app.get("/", (req, res) => {
  Todo.find((err, todos) => {
    // 把 Todo model 所有的資料都抓回來
    if (err) return console.error(err);
    return res.render("index", { todos: todos }); // 將資料傳給 index 樣板
  });
});
// 列出全部 Todo
app.get("/todos", (req, res) => {
  return res.redirect("/");
});
// 新增一筆 Todo 頁面
app.get("/todos/new", (req, res) => {
  return res.render("new");
});
// 顯示一筆 Todo 的詳細內容
app.get("/todos/:id", (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err);
    return res.render("detail", { todo: todo });
  });
});
// 新增一筆  Todo
app.post("/todos", (req, res) => {
  // 建立 Todo model 實例
  const todo = new Todo({
    name: req.body.name // name 是從 new 頁面 form 傳過來
  });
  // 存入資料庫
  todo.save(err => {
    if (err) return console.error(err);
    return res.redirect("/"); // 新增完成後，將使用者導回首頁
  });
});
// 修改 Todo 頁面
app.get("/todos/:id/edit", (req, res) => {
  res.send("修改 Todo 頁面");
});
// 修改 Todo
app.post("/todos/:id/edit", (req, res) => {
  res.send("修改 Todo");
});
// 刪除 Todo
app.post("/todos/:id/delete", (req, res) => {
  res.send("刪除 Todo");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
