const listing =require("./models/listing.js")
const review = require("./models/review.js")

module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl;
    } else {
      const { id } = req.params;
      if (id) {
        req.session.redirectUrl = `/listings/${id}`;
      } else {
        req.session.redirectUrl = "/listings"; 
      }
    }
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveredirecturl =(req,res,next)=>{
   if(req.session.redirectUrl)
      {
         res.locals.redirectUrl=  req.session.redirectUrl;
      }
      next();
}

module.exports.isowner = async(req,res,next)=>{
    let{id}=req.params;
  let Listing =await listing.findById(id);
   if( res.locals.curruser && !Listing.owner._id.equals(res.locals.curruser._id))
      {
        req.flash("error","you are not the owner of listing");
        return  res.redirect(`/listings/${id}`);
      }
      next();
}

module.exports.isreviewauthor = async(req,res,next)=>{
    let{id ,revid}=req.params;
  let Review =await review.findById(revid);
   if( !Review.author.equals(res.locals.curruser._id))
      {
        req.flash("error","you are not the author of this review");
        return  res.redirect(`/listings/${id}`);
      }
      next();
}