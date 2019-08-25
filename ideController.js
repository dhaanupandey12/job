var express = require("express"),
    bodyParser = require("body-parser");
var mongoose = require( "mongoose" );
var router = express.Router({ mergeParams: true });
var exec = require('exec');
var fs  = require('fs');
var php = require('exec-php');
var tmp = require('tmp');
require( 'dotenv' ).config();
var db = require( '../db' );
var User = require( "../../integrated - Copy/user/User" );
var verifyToken = require("../../integrated - Copy/auth/verifyToken");
//let ruby = require('ruby');
var cmd=require('node-cmd');
//var Builder = require('opal-compiler').Builder;
var exec = require('child_process').exec
const {c, cpp, node, python, java} = require('compile-run');
let r = Math.random().toString(36).substring(7);
console.log(r);
var dir = './'+r;
console.log(dir);

console.oldLog = console.log;
console.log = function(value)
{
console.oldLog(value);
return value;
};
//SCHEMA
var ide = require("./ide");


//COMPILEX
var compiler = require('compilex');
var options = { stats: true }; //prints stats on console
compiler.init(options);

//WEBCAM ACCESS
var multer = require( "multer" ),
  cloudinary = require( "cloudinary" );
var Photo = require("../photo/photo.js");
const storage = multer.diskStorage( {
  filename: function ( req, file, callback ) {
    callback( null, Date.now() );
  }
} );

const upload = multer( { storage: storage } )


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// router.get( "/photos", ( req, res ) => {
//   res.render( "photo" );
// } );


// router.get("/",function(req,res){
//     res.render("home");
// });

router.get("/photo", upload.single('image'),(req,res)=>{
  cloudinary.v2.uploader.upload(req.body.image, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      var image_url = result.secure_url;
      var text = {
        image_url: image_url
      }
      Photo.create(text, function (err, newPhoto) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(text);
          console.log(image_url);
        }
      });
    }
  });
});

router.post("/ide/run", function (req, res) {
  var x = req.body.input1;
  var lang = req.body.optradio;
    var y;
    switch (lang) {
      case "Node":
      
        y = eval(x);
        //res.render("home",{y:y});
        res.status(200).send({ output: y });
        break;
      case "Python":
        y = python.runSource(sourcecode);//,executionPath:'/home/dhanu/anaconda3/bin/python3.6'
        y
          .then(result => {
            console.log(result);

            //  res.render("home",{y:result.stdout});
            //res.render("home",{y:result.stdout,err:result.stderr});
            res.status(200).send({ output: y });
          })
          .catch(err => {
            console.log(err);

          });
        break;
      case "Cplus": y = cpp.runSource(sourcecode);//,executionPath:'/home/dhanu/anaconda3/bin/python3.6'
        y
          .then(result => {
            console.log(result);

            //  res.render("home",{y:result.stdout});
            //res.render("home",{y:result.stdout,err:result.stderr});
            res.status(200).send({ output: y });
          })
          .catch(err => {
            console.log(err);

          });
        break;
      case "C": y = c.runSource(sourcecode);//,executionPath:'/home/dhanu/anaconda3/bin/python3.6'
        y
          .then(result => {
            console.log(result);

            //res.render("home",{y:result.stdout,err:result.stderr});
            //res.render("home",{y:result.stdout,err:result.stderr});
            res.status(200).json({ output: y });
          })
          .catch(err => {
            console.log(err);

          });
        break;
      case "Java":

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        fs.writeFile('./' + dir + '/main.java', sourcecode, function (err) {
          if (err) throw err;
          else {
            console.log('saved');
            cmd.get(
              `
                      cd `+ r + `
                      ls
                      javac main.java
                      java main
                  `,
              function (err, data, stderr) {
                if (!err) {
                  console.log(data);
                  res.status(200).json({ y: data });
                } else {
                  console.log('error', err)
                }

              }
            );
          }
        });



        break;
      case "Php": fs.writeFile('hello.php', sourcecode, function (err) {
        if (err) throw err;
        console.log('saved');
      });

        php("../hello.php", function (err, php1, outprint) {
          console.log(outprint);
          res.render("home", { y: outprint });
        });
        break;
      case "Go": fs.writeFile('hello.go', sourcecode, function (err) {
        if (err) throw err;
        console.log('saved');
      });
        cmd.get(
          'go run hello.go',
          function (err, data, stderr) {
            console.log(data);

            // res.render("home",{y:data});
            res.status(200).json({ output: data });
          }

        )


        break;
      case "Ruby": fs.writeFile('main.rb', sourcecode, function (err) {
        if (err) throw err;
        console.log('saved');
      });
        cmd.get(
          'ruby main.rb',
          function (err, data, stderr) {
            console.log(data);
            res.status(200).json({ output: data });
          }
        )
        break;
      case "Kotlin":
        break;
    }
  // }
});

router.post( "/ide/submit/",verifyToken,function(req,res){
  // var x =  req.body.input1;
  // console.log(req.userId);
  var   lang          = req.body.optradio;
  const sourcecode    = req.body.input1;
  cmd.get(
    `
      rm -r `+ r + `
  `,
    function (err, data, stderr) {
      if (!err) {
        console.log(data);
      } else {
        console.log('error', err)
      }

    }
  );
    var newide = { code: sourcecode, language: lang ,user:req.userId};
    ide.create(newide, function (err, n_ide) {
      if (err)
        console.log(err);
      else {
        res.status(200).send({msg: "You have successfully submitted the test"});
      }
    });
});

router.get("/ide/usercodes/:userid",function(req,res){
ide.findOne({"user":req.params.userid}).populate("user").exec(function(err,iuser){
  if ( err )
   { console.log( err );
  res.status(404).send({msg:err});}
  else {
    res.status( 200 ).send( { user: iuser } );
  }
});
});
module.exports = router;
