//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
//to check for .env file working or not
// console.log(process.env.field_name);

app.set("view engine","ejs");
mongoose.set("strictQuery",false);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    Email : String,
    Password : String
});


userSchema.plugin( encrypt, { secret: process.env.SECRET,encryptedFields: ["Password"] });

const User = mongoose.model("User", userSchema);

app.get("/",function(req, res){
    res.render("home");
});

app.get("/login",function(req, res){
    res.render("login");
});

app.get("/register",function(req, res){
    res.render("register");
});

app.post("/register", async(req, res) => {
    try{
        const newUser = new User({
            Email : req.body.username,
            Password : req.body.password
        });

    await newUser.save();
    console.log("Successfully inserted !");
    res.render("secrets");
    }catch(err){
        console.log(err);
             }
    });

app.post("/login", async(req, res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;

        const foundUser = await User.findOne({Email : username});
        if(foundUser){
            if(foundUser.Password === password ){
                res.render("secrets");
            }
            
        }
             
    }catch(err){
        res.send(err);
    }
});








app.listen(3000, function(){
    console.log("Server started on port 3000.")
});                                