const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(bodyParser.json());
const authRoutes = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blog");
const { static } = require("express");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/v1/auth", authRoutes);
app.use("/v1/blog", blogRoutes);

app.use((error, req, res, next) => {
  const status = error.errorStatus;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect(
    "mongodb+srv://iqbal:5wyTo3RIgop6aDa7@cluster0.mvtos.mongodb.net/blog?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(4000, () => console.log("connection success"));
  })
  .catch((err) => console.log(err));

// mongo pass 9arKitwESf9d0BBw // GMbEjdQpxd4FOeSj // 5wyTo3RIgop6aDa7
