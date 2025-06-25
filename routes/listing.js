const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const {isloggedin,isowner}=require("../middlewear.js");
const listingcontroller = require("../controller/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudconfig.js")
const upload = multer({ storage })


router.route("/")
.get( wrapasync(listingcontroller.index))
.post(isloggedin, upload.single("image"),wrapasync(listingcontroller.createlisting));

 // search route
  router.route("/q")
   .get(wrapasync(listingcontroller.getsearchlisting))

//new route
router.get("/new",isloggedin,listingcontroller.rendernewform);

router.route("/:id")

.get( wrapasync(listingcontroller.showlistings))
.patch(isloggedin,isowner, upload.single("image"), wrapasync(listingcontroller.updatelisting))
.delete(isloggedin, isowner,wrapasync(listingcontroller.deletelisting));

//edit route
  router.get("/:id/edit",isloggedin,isowner, wrapasync(listingcontroller.editlisting));


module.exports = router;