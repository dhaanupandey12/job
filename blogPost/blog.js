var mongoose = require('mongoose');
var blogschema   = mongoose.Schema({

title:String,
description:String,
verify:{type:Boolean,default:false},
category:String,
type:{
  image:String,
  video:String,
  text:String
},
createdAt:{type:Date,default:Date.now},
lastUpdated:{type:Date,default:Date.now},
category:String,
verifired:{type:Boolean,default:false},
likecounter:[],
viewcounter:[],
user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
},
comment:[{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Comment"
}]
});

module.exports = mongoose.model("Blog",  blogschema );
