var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User     =    require('../user/User');
var Blog   = require('./blog');
var bodyParser = require('body-parser');
var verifyToken = require("../auth/verifyToken");

router.post('/:userid',(req,res)=>{
id = req.params.userid;
title=req.body.title;
description=req.body.description;
type= req.body.type;

blog = new Blog({
  title : title,
  description:description,
  type:type,
  category:req.body.category
});

blog.save((err,blogs)=>{
  if(err)
  {
    res.send({msg:err});
  }
  else{
    blogs.user= id;
    blogs.save();
    res.send(blogs);
  }
})
});


router.get( "/",(req,res,next) => {
    var page = parseInt(req.query.page);
    var size = req.query.size;
    if( size === undefined )
        size =5;
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
    Blog.find({},{},{skip:skip,limit:limit}).sort({id:-1})
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

// router.patch("/:blogid", (req, res, next) => {
//   const id = req.params.blogid;
//   const updateOps = {};
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value;
//   }
//   Blog.update({ _id: id }, { $set: updateOps })
//     .exec()
//     .then(result => {
//       res.status(200).send(result);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).send({
//         error: err
//       });
//     });
// });
router.put("/:blogid",(req, res, next) => {

    const id = req.params.id;

    if (req.body.hasOwnProperty('password')) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    Blog.findByIdAndUpdate(id, req.body)
        .exec()
        .then(result => {
            msg: "Updated successfully"
            res.status(200).send(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                msg: err
            });
        });
});



router.delete("/:blogid",(req,res,next) => {
  const id = req.params.blogid;
      Blog.remove({_id: id})
      .exec()
      .then(res =>{
          res.status(200).send(res);
      })
      .catch(err =>{
          console.log(err);
          res.status(500).send({
              msg: err
          });
      });
});

//aggregate
router.get("/category",async function(req,res){
  Blog.aggregate( [
    { $group: { _id: "$category", no_of_blogs: { $sum: 1 } } },
    { $project: { _id: 1,/*  Location: "$_id", */ no_of_blogs: 1 } },
    { $sort: { tags: -1 } }
  ] ).exec( ( err, result ) => {
    if ( err ) {
      console.log( err );
      res.status( 404 ).send( { msg: err } );
    } else {
      res.status( 200 ).send( { data: result } );
    }
  } );
});
router.get( "/category/:name", async function ( req, res ) {
  var page = parseInt( req.query.page );
  var size = req.query.size;
  if ( size === undefined )
    size = 10;
  else
    size = parseInt( req.query.size );
  if ( page < 0 || page === 0 ) {
    response = {
      "error": true,
      "message": "invalid page number, should start with 1"
    };
    res.send( response );}
  var skip = size * ( page - 1 )
  var limit = size;
  Blog.find({"category":req.params.name},{},{skip:skip,limit:limit},function(err,b){
    if ( err ) {
      console.log( err );
      res.status( 404 ).send( { msg: err } );
    } else {
      res.status( 200 ).send( { data: b } );
    }
  });
} );


router.get("/pages/count", function (req, res) {
  Blog.countDocuments().exec((err, result) => {
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


router.get( "/trending",(req,res,next) => {
  var limit=5;
  Blog.find({},{},{limit:limit}).sort({likecounter:-1})
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

router.get('/monthcount',(req,res)=>{
  Blog.aggregate([

          { $group : {
                _id : {
                        month: { $month: "$createdAt" },
                       },
                        count : {$sum : 1}
                }
           }
        ]).exec( ( err, result ) => {
    if ( err ) {
      console.log( err );
      res.status( 404 ).send( { msg: err } );
    } else {
      res.status( 200 ).send( { data: result } );
    }
  } );

});
router.get("/search/:title",function(req,res){
  Blog.find( {
    "title": {
      $regex: req.params.title,
      $options: "i"
    }
  }, ( err, search ) => {
    if ( err ) return res.status( 500 ).send( {
      msg: err
    } );
    res.status( 200 ).send( {
      count: search.length,
      data: search
    } );
<<<<<<< HEAD

  } );
});








=======
  } );
});

>>>>>>> 1e01e4f636b2b9596842f3453e8510072afecabf

router.get('/distictCategory',(req,res)=>{


Blog.find().distinct('category',(err,cat)=>{
  if(err)
  {
    res.status(500).send({msg:err});
  }
  else{
    res.status(200).send(cat);
  }
<<<<<<< HEAD

=======
>>>>>>> 1e01e4f636b2b9596842f3453e8510072afecabf

});

});


var lcount=0;
router.get('/likecounter/:blogid',(req,res)=>{
Blog.findById(req.params.blogid,(err,blogs)=>{
  var result = blogs.likecounter;
  result.forEach((res)=>{
    console.log(res);
    lcount++
    //console.log(count);
  });
  res.status(200).send({likes:lcount});
});

});

var vcount=0;
router.get('/viewcounter/:blogid',(req,res)=>{
Blog.findById(req.params.blogid,(err,blogs)=>{
  var result = blogs.viewcounter;
  result.forEach((res)=>{
    console.log(res);
    vcount++
    //console.log(count);
  });
  res.status(200).send({view:vcount});
});

});

var ccount=0;
router.get('/commentcounter/:blogid',(req,res)=>{
Blog.findById(req.params.blogid,(err,blogs)=>{
  var result = blogs.comment;
  result.forEach((res)=>{
    console.log(res);
    ccount++
    //console.log(count);
  });
  res.status(200).send({comments:ccount});
<<<<<<< HEAD

=======
>>>>>>> 1e01e4f636b2b9596842f3453e8510072afecabf
});

});

router.get('/commentinfo/:blogid',(req,res)=>{
    Blog.findById(req.params.blogid).populate({path:"comment",populate:{path:"user",select:"name"}}).select("comment").exec((err,comments)=>{
           if(err)
           {
             res.status(500).send({msg:err});
           }
           else{
             res.status(200).send(comments);
           }



    });
         // Blog.aggregate( [
         //   { $group: { _id: "$category", no_of_blogs: { $sum: 1 } } },
         //   { $project: { _id: 1,/*  Location: "$_id", */ no_of_blogs: 1 } },
         //   { $sort: { tags: -1 } }
         // ] )


   });






module.exports = router;
