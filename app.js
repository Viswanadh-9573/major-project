 if(process.env.NODE_ENV!="production"){
   require('dotenv').config()
 }
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsmate =require("ejs-mate");
const methodoverride = require("method-override");
const ExpressError =require("./utils/expresserror.js")
const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const User =require("./models/user.js");
const localstrategy = require("passport-local");

const user =require("./routes/user.js");
const listings = require("./routes/listing.js");
const reviews= require("./routes/review.js");
const dburl ="mongodb+srv://viswanadhvunnamatla:Nc4OPjaZw2MLZxJU@cluster0.x1ax3pc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
app.engine("ejs",ejsmate);
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

  main()
  .then( ()=>{
      console.log("connection succesfull")
  })
  .catch(err => console.log(err));

  async function main() {
    await mongoose.connect(dburl);
  
  }

  const store =MongoStore.create({
     mongoUrl:dburl,
     crypto:{
        secret:process.env.SECRET,
     },
     touchAfter:24*3600,
  })
   
  store.on("error",()=>{
      console.log("error in MONGO SESSION STORE",err);
  })

const sessionoptions ={
     store,
      secret:process.env.SECRET,
     resave: false,
     saveUninitialized:true,
     cookie:{
         expires:Date.now()+7 * 24 * 60 * 60 *1000,
         maxAge:7 * 24 * 60 * 60 *1000,
         httpOnly:true
     }
}



app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy (User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


 
app.use((req,res,next)=>{
   res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
      res.locals.curruser=  req.user;
   next();
})

app.get("/",()=>{
   res.send("welocome to my web page");
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
 app.use("/",user);

 app.use((req, res,next) => {
     next(new ExpressError(404 ,"page not found"))
});

 app.use((err, req, res, next) => {
   let {statusCode =500,message ="something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{message});
});


app.listen(3000,()=>{
    console.log("server is running");
})