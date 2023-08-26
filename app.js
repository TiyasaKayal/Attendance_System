const express= require('express');
const imageDataURI = require('image-data-uri');
const ejs = require('ejs');
const fs = require('fs');
const mongoose = require('mongoose');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path')
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true }));
app.use(bodyParser.json());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/labeled_images')
    },
    filename: function (req, file, cb) {
      
      cb(null, req.body.rollno + "." + file.originalname.substring(file.originalname.indexOf('.')+1) )
    }
  })
const upload = multer({storage: storage})
mongoose.connect('mongodb+srv://devd:gotohell789@cluster0.vrmxn.mongodb.net/?retryWrites=true&w=majority',{
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(()=>console.log("connected")).catch((err)=>console.log(err));


app.set('view engine', 'ejs');
 app.listen(process.env.PORT || 3000, ()=>{
     console.log("up and running");
 })

 const Router = require("./router/routes");
 app.use("/",Router);
