const listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.postreview =async(req,res)=>{
      let {id}=req.params;
      console.log(id)
      let Listing = await  listing.findById(id);
      let newreview = new review(req.body.review);
        newreview.author = req.user._id;
      Listing.reviews.push(newreview);
      await  newreview.save();
       await  Listing.save();
         req.flash("success","review added");
        res.redirect(`/listings/${id}`);
      
};

module.exports.deletereview =async(req,res)=>{
    let{id ,revid}=req.params;
    await listing.findByIdAndUpdate ( id,{$pull:{reviews:revid}});
    await review.findByIdAndDelete(revid);
      req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);

};