const express = require("express");
const wrapasync = require("../utils/wrapasync");
const router = express.Router();
const User =require("../models/user.js");
const passport = require("passport");
const {saveredirecturl}=require("../middlewear.js")
const usercontroller = require("../controller/user.js")

router.route("/signup")
.get( usercontroller.getsignup)
.post(wrapasync(usercontroller.postsignup));

router.route("/login")
.get( usercontroller.getlogin)
.post(saveredirecturl, passport.authenticate("local",{failureFlash:true, failureRedirect:"/login"}),usercontroller.postlogin);

//logout page
router.get("/logout",usercontroller.logout)
module.exports =router;