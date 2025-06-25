const express = require("express");
const router = express.Router({mergeParams:true});
const listing = require("../models/listing.js");
const review = require("../models/review.js");
const {isreviewauthor,isloggedin}=require("../middlewear.js")
const wrapasync = require("../utils/wrapasync.js");
const reviewcontroller = require("../controller/review.js")



// posting a review
router.post("/",isloggedin, wrapasync(reviewcontroller.postreview));
 
//deleting a review
router.delete("/:revid",isloggedin,isreviewauthor,wrapasync (reviewcontroller.deletereview));
module.exports = router;