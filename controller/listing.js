const listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN ;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });
module.exports.index=async(req,res)=>{
     let lists =  await  listing.find({})
     res.render("listings/home.ejs",{lists});
};

module.exports.createlisting =async (req, res) => {

  let response =await geocodingClient.forwardGeocode({
  query: req.body.listing.location ,
  limit: 1
})
  .send()

    let url =req.file.path;
    let filename = req.file.filename;
  const data = req.body.listing;
  const newlisting = new listing(data);
  newlisting.owner = req.user._id;
    newlisting.image ={url,filename};
    newlisting.geometry =response.body.features[0].geometry;
   let savelisting = await newlisting.save();
  req.flash("success","new listing created");
  res.redirect("/listings");
};

module.exports.rendernewform =(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showlistings =async(req,res)=>{
    let {id}= req.params;
    let list = await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!list)
        {
           req.flash("error","the listing you requested doesn't exsist"); 
            return res.redirect("/listings");
        }
    res.render("listings/show.ejs",{list});
};

module.exports.editlisting =async (req, res) => {
    let { id } = req.params;
    const list = await listing.findById(id);
   if(!list)
        {
           req.flash("error","the listing you requested doesn't exsist"); 
           return res.redirect("/listings");
        }
        let originalurl = list.image.url.replace("/upload", "/upload/h_300,w_250");

    res.render("listings/edit.ejs", { list,originalurl });
};

module.exports.updatelisting = async (req, res) => {
  let { id } = req.params;
  let updatedData = req.body.listing;

  let Listing = await listing.findById(id);

  if (!Listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  Listing.title = updatedData.title;
  Listing.description = updatedData.description;
  Listing.price = updatedData.price;
  Listing.country = updatedData.country;

  if (updatedData.location !== Listing.location) {
    Listing.location = updatedData.location;

    const response = await geocodingClient
      .forwardGeocode({
        query: updatedData.location,
        limit: 1,
      })
      .send();

    if (response.body.features.length > 0) {
      Listing.geometry = response.body.features[0].geometry;
    } else {
      req.flash("error", "Could not find coordinates for this location");
      return res.redirect(`/listings/${id}/edit`);
    }
  }

  if (req.file) {
    const { path, filename } = req.file;
    Listing.image = { url: path, filename };
  }

  await Listing.save();

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};


module.exports.deletelisting =async(req,res)=>{
  let{id}=req.params;
  await listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");

};


module.exports.getsearchlisting = async (req, res) => {
  let search = req.query["search-result"]; 
  let listings = await listing.find({});   
  res.render("listings/search.ejs", { search, listings });
};

 