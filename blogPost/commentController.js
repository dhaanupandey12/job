var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User     =    require('../user/User');
var Blog   = require('./blog');
var Comment = require('./comment');
var bodyParser = require('body-parser');
var verifyToken = require("../auth/verifyToken");

router.post('/:userid/:blogid',(req,res)=>{
userid = req.params.userid;
blogid = req.params.blogid;
comments = req.body.comments;
likes   = req.body.likes;
view   =  req.body.view;

comment = new Comment({
  comments : comments,
  likes    : likes,
  view    : view
});

comment.save();
if(req.body.likes==true)
{  console.log("entering");
    var update ={
    $addToSet: { likecounter : req.params.userid,viewcounter:req.params.userid }
     }

}
else if(req.body.view==true)
{
  var update ={
     //$addToSet: { likecounter : req.params.userid },
        $addToSet: { viewcounter : req.params.userid }
      }
}
User.findById(userid,(err,user)=>{
  if(err)
  {
    res.send({msg:err});
  }
  else{
  Blog.findByIdAndUpdate(blogid,update,(err,blog)=>{
    if(err)
    {
      res.send({msg:err});
    }
    else{

      blog.comment.push(comment);
      comment.user.push(user);
      blog.save();
      comment.save();
      res.status(500).send(comment);
    }
  });
  }
});

});

router.post('/:userid/:blogid/:commentid',(req,res)=>{
  comments = req.body.comments;
  likes  = req.body.likes;
  view   =  req.body.view;

  var c = new Comment({
    comments : comments,
    likes    : likes,
    view    : view
  });

  c.save();

var id = req.params.commentid;
console.log(id);

  Comment.findById(id,(err,comments)=>{
    if(err)
    {
      req.status(500).send({msg:err});
    }
    else{
      console.log(comments);
       comments.children.push(c);
      // comments.children.user.push(req.params.userid);

      // comments.save();
      res.status(200).send(comments);
    }
  });

  // User.findById(req.params.userid,(err,users)=>{
  //  if(err)
  //  {
  //    res.status(500).send({msg:err});
  //  }
  //  else{
  //    Blog.findById(req.params.blogid,(err,blogs)=>{
  //     if(err)
  //     {
  //       res.status(500).send({msg:err});
  //     }
  //     else{
  //       Comment.findById(req.params.commentid,(err,comment)=>{
  //         if(err)
  //         {
  //           res.status(500).send({msg:err});
  //         }
  //         else{
  //         comment.blog.push(blog)
  //
  //         }
  //       })
  //     }
  //
  //    });
  //  }
  //
  // })

});



router.get( "/",(req,res,next) => {
    var page = parseInt(req.query.page);
    var size = req.query.size;
    if( size === undefined )
        size = 10;
    else
        size = parseInt( req.query.size );
        if(page < 0 || page === 0) {
            response = {
                "error": true,
                "message": "invalid page number, should start with 1"
            };
            res.send( response );
        }
    var skip = size * (page - 1)
    var limit = size;
    Comment.find({},{},{skip:skip,limit:limit}).sort({id:-1})
    .exec()
    .then(docs => {
            res.status(200).send(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({
            msg: err
        });
    });
});
// var lcount=0;
// router.get('/likecounter/:blogid',(req,res)=>{
// Blog.findById(req.params.blogid,(err,blogs)=>{
//   var result = blogs.likecounter;
//   result.forEach((res)=>{
//     console.log(res);
//     lcount++
//     //console.log(count);
//   });
//   res.status(200).send({likes:lcount});
// });
//
// });
//
// var vcount=0;
// router.get('/viewcounter/:blogid',(req,res)=>{
// Blog.findById(req.params.blogid,(err,blogs)=>{
//   var result = blogs.viewcounter;
//   result.forEach((res)=>{
//     console.log(res);
//     vcount++
//     //console.log(count);
//   });
//   res.status(200).send({view:vcount});
// });
//
// });
//
// var ccount=0;
// router.get('/commentcounter/:blogid',(req,res)=>{
// Blog.findById(req.params.blogid,(err,blogs)=>{
//   var result = blogs.comment;
//   result.forEach((res)=>{
//     console.log(res);
//     ccount++
//     //console.log(count);
//   });
//   res.status(200).send({comments:ccount});
// });
//
// });

router.get("/pages/count", function (req, res) {
  Comment.countDocuments().exec((err, result) => {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            var page = Math.ceil(result / 10);
            res.status(200).send({
                pages: page,
                count: result
            });
        }
    });
});




module.exports = router
