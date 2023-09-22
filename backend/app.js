const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const tripsRoutes = require("./routes/trips-routes");
const usersRoutes = require("./routes/users-routes");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");

const path = require("path");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));
//이미지 반환

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/trips", tripsRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  //없는 경로 처리
  const error = new HttpError("해당 경로를 찾을 수 없습니다.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    //응답이 이미 전송되었다면
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "알 수 없는 오류가 발생했습니다!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@atlascluster.yj5zfpn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
