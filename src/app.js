const express = require("express");
const config = require('config');
const conn = require('../src/common/database');
var cookieParser = require('cookie-parser')
const app = express();
const { notFound, errHandle } = require('../src/apps/middlewares/errHandle');

app.use(cookieParser());

//config view
app.set("views", config.get("app.view_folder"));
app.set("view engine", "ejs");

//sử dụng để dùng gửi dữ liệu từ From lên post
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

//config static public ta chỉ cần đưa css bootstrap js vào public gỡ đường link /static
app.use("/public", express.static(config.get("app.static_folder")));







app.use(require(config.get("app.router")));
app.use(notFound);
app.use(errHandle);
module.exports = app;