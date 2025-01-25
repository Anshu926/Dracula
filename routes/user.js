const express = require("express");
const router = express.Router({});
const User = require("../models/user.js")
const wrap_async = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../Controllers/listings.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
});

router.post("/signup",wrap_async(  async(req,res)=>{
    try {
        let {username,email,password} = req.body;
        const newUser =  new User ({email,username});
        const registreedUser =  await User.register(newUser , password);
        // console.log(registreedUser);
        req.login(registreedUser,(err)=>{
            if (err) {
                    return next(err);
            }
            req.flash("success","Welcome to Wonderlust !!");
            res.redirect("/listings");
        })
     
    } catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
  
} ));

router.get("/login",async(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect : "/login",failureFlash : true}),
       async (req,res)=>{
            req.flash("success","Welcome to Wonderlust ; you'r successfully login !");
            let redirectUrl = res.locals.redirectUrl  || "/listings";

            res.redirect(redirectUrl);
        });

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if (err) {
            next(err);
        }
        req.flash("success","You are successfully logged out !");
        res.redirect("/listings");
    })
});

       
module.exports = router;