var mongoose = require("mongoose");
var User = require("../../integrated - Copy/user/User");
const ideSchema = mongoose.Schema({
    code:String,
    language:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    // createdAt:{type:Date,default:Date.now},
    // lastUpdated:{type:Date,default:Date.now}
});
module.exports = mongoose.model("Ide", ideSchema);