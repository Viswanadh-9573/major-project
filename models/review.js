const mongoose = require("mongoose");
const reviewschema = new mongoose.Schema({
    comment:String,
    rating:{
         type:String,
          min:1,
        max:5 },
     createdat :
       {
          type:Date,
           default:Date.now()
       },
         author:
           {
              type:mongoose.Schema.Types.ObjectId,
              ref:"user"
           }
       
});
module.exports =mongoose.model("review",reviewschema);