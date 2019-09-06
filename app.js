const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

app.use(bodyParser.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// 設定 method-override
app.use(methodOverride("_method"));

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
  Todo.find({})
    .sort({ name: "asc" })
    .exec((err, todos) => {
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
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err);
    return res.render("edit", { todo: todo });
  });
});
// 修改 Todo
app.put("/todos/:id", (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err);
    todo.name = req.body.name;
    if (req.body.done === "on") {
      todo.done = true;
    } else {
      todo.done = false;
    }
    todo.save(err => {
      if (err) return console.error(err);
      return res.redirect(`/todos/${req.params.id}`);
    });
  });
});
// 刪除 Todo
app.delete("/todos/:id/delete", (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err);
    todo.remove(err => {
      if (err) return console.error(err);
      return res.redirect("/");
    });
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
