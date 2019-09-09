const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");

app.use(bodyParser.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// 設定 method-override
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "your secret key", // secret: 定義一組屬於你的字串做為私鑰
    resave: false,
    saveUninitialized: true
  })
);

mongoose.connect("mongodb://localhost/todo", { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error!");
});

// 連線成功
db.once("open", () => {
  console.log("mongodb connected!");
});

// 載入路由器
app.use("/", require("./routes/home"));
app.use("/todos", require("./routes/todo"));
app.use("/users", require("./routes/user"));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
