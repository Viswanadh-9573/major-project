const mongoose = require("mongoose");
const review = require("./review");
const user =require("./user")
let listingschema = new mongoose.Schema({

    title:{
        type:String
    },
    description:String,
    image: {
  url: String,
  filename: String,
    },

    price:Number,
    location :String,
    country:String,

  reviews:[
    {
     type:mongoose.Schema.Types.ObjectId,
      ref: "review",
    }
  ],
  owner :
    {
       type:mongoose.Schema.Types.ObjectId,
       ref:"user"
    },

    geometry: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
    
});
const  listing = mongoose.model("listing",listingschema);
module.exports = listing;
