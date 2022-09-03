//jshint esversion:6
require("dotenv").config();  /*Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.*/
//environment variables is a file where we can keep our sensitive keys or important keys such as api keys

const express =require("express");
const bodyParser=require("body-parser");
const ejs= require("ejs");
const mongoose = require("mongoose");
const encrypt= require("mongoose-encryption"); //npm i mongoose-encryption

const app=express();

console.log(process.env.API_KEY); //will access api key from .env file

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/useDB", {useNewUrlParser: true});

const userSchema=new mongoose.Schema({

    email:String,
    password:String
});


//will access secret from .env file
userSchema.plugin(encrypt,{requireAuthenticationCode:false,secret:process.env.SECRET,encryptedFields:["password"]}); //encrypt are password(it'll not show our password)

const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
})

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},function(err,foundUser){ //decrypt the password to check wheather the password is same or not
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets"); 
                }
            }
        }
    })
})

app.listen(3000,function(){
    console.log("server started on port 3000");
});