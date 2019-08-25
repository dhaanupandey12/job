var mongoose = require('mongoose');
var commentschema = mongoose.Schema({


  comments : String,
  likes  : Boolean,
  view     :  Boolean,
  blog:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog'
  },
  createdAt:{type:Date,default:Date.now},
  lastUpdated:{type:Date,default:Date.now},
  user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
  }],

  children: {        type: [ {  type: mongoose.Schema.Types.ObjectId,
                      ref: 'Comment',  }],
                  default: []
                        }
});


module.exports = mongoose.model('Comment' , commentschema);
