const express = require("express");
const app = express();
// 判別開發環境
if (process.env.NODE_ENV !== "production") {
  // 如果不是 production 模式
  require("dotenv").config(); // 使用 dotenv 讀取 .env 檔案
}

const port = 3000;
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport"); // 載入 passport
const flash = require("connect-flash");

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

// 使用 Passport
app.use(passport.initialize());
app.use(passport.session());

// 載入 Passport config
require("./config/passport")(passport);
// 登入後可以取得使用者的資訊方便我們在 view 裡面直接使用
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// 登入後可以取得使用者的資訊方便我們在 view 裡面直接使用
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated(); // 辨識使用者是否已經登入的變數，讓 view 可以使用
  next();
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/todo", {
  useNewUrlParser: true,
  useCreateIndex: true
});

const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error!");
});

// 連線成功
db.once("open", () => {
  console.log("mongodb connected!");
});

app.use(flash()); // 使用 Connect flash

// 建立 local variables
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated(); // 辨識使用者是否已經登入的變數，讓 view 可以使用

  // 新增兩個 flash message 變數
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  next();
});

// 載入路由器
app.use("/", require("./routes/home"));
app.use("/todos", require("./routes/todo"));
app.use("/users", require("./routes/user"));
app.use("/auth", require("./routes/auths")); // 把 auth route 加進來

app.listen(process.env.PORT || port, () => {
  // console.log(`http://localhost:${port}`);
  console.log("App is running");
});
