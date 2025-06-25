const User =require("../models/user.js");
const passport = require("passport");
 
module.exports.getsignup = (req,res)=>{
   res.render("users/signup.ejs");
};

module.exports.postsignup =async(req,res)=>{
    try{
       let{email,username,password}=req.body;
       let newuser = new User({email,username});
       const registeruser = await User.register(newuser,password);
       req.login(registeruser,(err)=>{
           if(err)
            {
               next(err)
            }
             req.flash("success","welcome to wonderlust");
       res.redirect("/listings");
       })
    

    }catch(e){
       req.flash("error",e);
       res.redirect("/signup");
    }
};

module.exports.getlogin = (req,res)=>{
   res.render("users/login.ejs");
};

 module.exports.postlogin =async(req,res)=>{
     req.flash("success","welcome back to wonderlust");
     let redirecturl = res.locals.redirectUrl||"/listings";
     res.redirect(redirecturl);
};

module.exports.logout =(req,res,next)=>{
   req.logOut((err)=>{
      if(err)
         {
            next(err);
         }
         req.flash("success","you are logged out now");
        res.redirect("/listings");
   })
};
