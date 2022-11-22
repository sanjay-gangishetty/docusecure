const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const {
  GridFsStorage
} = require("multer-gridfs-storage");
const { response } = require("express");
require("dotenv")
  .config();


app.use(bodyParser.json());
app.use(methodOverride('_method'));

const mongoURI = "mongodb+srv://admin-sanjay:test123@anonshare-cluster.h1lr5ew.mongodb.net/documentsdb";
const conn = mongoose.createConnection(mongoURI,{useNewUrlParser: true, useUnifiedTopology: true});

let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise ((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if(err){
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      })
    })
  }
});
const upload = multer({storage});

const Idandpass = conn.model("Idandpass",mongoose.Schema({
  userid: String,
  password: String,
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/files/:filename", (req,res) => {
  gfs.files.findOne({filename: req.params.filename}, (err,file) => {
  if (!file || file.length === 0){
    return res.status(404).json({
      err: "no file exists"
    });
  }
  return res.json(file);
  });
});

app.get("/image/:filename", (req,res) => {
  gfs.files.findOne({filename: req.params.filename}, (err,file) => {
  if (!file || file.length === 0){
    return res.status(404).json({
      err: "no file exists"
    });
  }

  if(file.contentType === "image/jpeg" || file.contentType === "image/png"){
    var readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  }else{
    res.status(404).json({
      err: "Not an image"
    });
  }
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/home');
});

app.get("/", function (req, res) {
  res.render("main.ejs");
});

app.delete("/files/:id", (req, res) => {
  gfs.remove({ _id: req.params.id, root: "uploads" }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
    res.redirect("/home");
  });
});

app.get("/upload",function(req,res){
  res.render("upload");
  res.send("Successfully uploaded the image");
  res.redirect("/");
})

app.get("/home", function (req, res) {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      res.render('home', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('home', { files: files });
    }
  });   
});

app.post("/home",  upload.single("file"), (req, res) => {
  res.redirect("/home");
});

app.get("/signup", function (req, res) {
  res.render("signup.ejs");
});

app.post("/signup", function (req, res) {
  username = req.body.username;
    p1 = req.body.password;
    p2 = req.body.confirmPassword;
  bcrypt.hash(p1, saltRounds, function(err, hash){
    const newUser = new Idandpass({
      userid: username,
      password: hash
    });
    if (p1 === p2) {
      newUser.save((err) => {
        if(err){
          console.log(err);
        }else{
          res.redirect("/home");
        }
      });
    } else {
      res.send("The password and confirm password fields must match.");
    }
  }) 
});

app.get("/login", function (req, res) {
  res.render("login.ejs");
});

app.get("/logout", function(req,res){
  res.redirect("/");
})

app.post("/login", function(req, res) { 
  loginId = req.body.username;
  loginPassword = req.body.password;
  Idandpass.findOne({ userid: loginId }, function(err, foundUser) {
     if(err){
      console.log(err);
     }else{
      if(foundUser){
        bcrypt.compare(loginPassword, foundUser.password, function(err, result){
          if(result === true){
            res.redirect("/home");
          }
        })
      }
     }  
  });
});

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started Successfully.");
});
