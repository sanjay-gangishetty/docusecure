require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { authenticate } = require("passport");

app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
// "mongoose": "^6.8.0",
app.use(passport.initialize());
app.use(passport.session());

mongoose.set('strictQuery', true);
const mongoURI = process.env.MONGO_LINK;
mongoose.connect(mongoURI);

const IdandpassSchema = new mongoose.Schema({
  userid: String,
  password: String,
});

const ImageSchema = new mongoose.Schema({
  pin: Number,
  image: String,
});

IdandpassSchema.plugin(passportLocalMongoose);

const ImageModel = mongoose.model("imageModel", ImageSchema);
const Idandpass = new mongoose.model("idandpass", IdandpassSchema);

passport.use(Idandpass.createStrategy());
passport.serializeUser(Idandpass.serializeUser());
passport.deserializeUser(Idandpass.deserializeUser());

const storage = multer.diskStorage({
  destination: "publicImg",
  filename: (req, file, cb) => {
    cb(null,file.originalname);
  },
});

let upload = multer({
  storage: storage
});

app.get("/authenticate", function (req, res) {
  if(req.isAuthenticated()){
    res.render("authenticate");
  }else{
    res.redirect("/");
  }
});

app.post("/authenticate", function (req, res) {
  const UserPin = req.body.Pin;
  ImageModel.find({ pin: UserPin }, (err, foundImages) => {
        if(err){
          console.log(err);
        }else{
          if(foundImages.length === 0){
            res.send("<h1>Please check your pin and retry.</h1>");
          }else{
            res.redirect("/download");
          }
        }
  });
});

app.get("/download", function (req, res) {
  if(req.isAuthenticated()){
    res.render("download");
  }else{
    res.redirect("/");
  }
});

app.post("/download", function(req,res){
 const UserReq = req.body.downloadReq;
 const file = __dirname+"/publicImg/"+UserReq;
 ImageModel.find({image: UserReq},(err,foundImages) => {
  if(foundImages.length === 0){
    res.send(err);
  }else{
 res.download(file);
  }
 })
})

app.get("/", function (req, res) {
  res.render("main.ejs");
});

app.get("/home", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("home");
  } else {
    res.redirect("/");
  }
});

app.get("/upload", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("upload");
  } else {
    res.redirect("/");
  }
});

app.post("/upload", upload.single("file"), function (req, res) {
  ImageModel.create(
    { image: req.file.filename, pin: req.body.pin },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/upload");
      }
    }
  );
});

app.get("/register", function (req, res) {
  res.render("register.ejs");
});

app.post("/register", function (req, res) {
  const username = req.body.username;
  const p1 = req.body.password;
  const p2 = req.body.confirmPassword;

  Idandpass.register({ username: username }, p1, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/home");
      });
    }
  });
});

app.get("/login", function (req, res) {
  res.render("login.ejs");
});

app.post("/login", function (req, res) {
  const loginId = req.body.username;
  const loginPassword = req.body.password;

  const user = new Idandpass({
    username: loginId,
    password: loginPassword,
  });

  req.login(user, function (err) {
    if (err) {
     console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/home");
      });
    }
  });
});

app.get("/logout", function (req, res) {
  res.redirect("/");
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Server has started Successfully.");
});
