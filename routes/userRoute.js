const express=require("express");
const wrapAsync=require("../utils/wrapAsync")
const ExpressError=require("../utils/expressError")
const router=express.Router();
const User=require("../models/User");

const passport=require("passport");


//create new user
router.get("/signup",async (req,res)=>{
    
    res.render("user/signup.ejs");
})


//create new user
router.post("/signup",wrapAsync(async (req,res)=>{
    console.log("POST REQ FOR USER");
try{
    const {username,email,password}=req.body;
    const NewUser=new User({
        username,  email
    })
    const respose=await User.register(NewUser,password);
    console.log(respose);
    req.flash("SUCCESS","CONGRATULATIONS YOU ARE REGISTERED!")
    res.redirect("/Listings")
}
catch(e)
{
    req.flash("ERROR",e.message)
    res.redirect("/signup");
}
})
)


//login  user
router.get("/login",async (req,res)=>{
    
    res.render("user/login.ejs");
})


//login  user
//FAILUREFLASH SHOWS FLASH IF FAILURE
router.post("/login",passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}) ,
async (req,res)=>{
    req.flash("SUCCESS","YOU ARE LOGGED IN!")
    res.redirect("/Listings")
}
)


module.exports=router;