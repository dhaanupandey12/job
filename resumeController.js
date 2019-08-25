const express   = require("express"),
      mongoose  = require("mongoose"),
      ejs       = require("ejs"),
      fs        = require("fs"),
      pdf       = require("html-pdf");

var user = require('./user/User');

var router = express.Router();
// var html = fs.readFileSync('./views/resume.ejs', 'utf8');
var options = { format: 'Letter' };
var html;
router.get("/:id", (req, res) => {
    var id= req.params.id;

  user.findById(id)
  .populate('user_info user_edu technical_skills personal_skills projects workHistory')
  .exec((err,u)=>{
   if(err)
   {
     console.log(err);
     res.status(500).send({msg:err});
   }
   else{
    //  console.log(u);
    //  console.log(user.technical_skills);
     ejs.renderFile('./views/resume.ejs',{user:u},function(err,result){
       if(err){
         console.log(err);
       } else {
         html = result;
         pdf.create(html, options).toBuffer(function (err, buffer) {
           if (err) return res.send(err);
           res.type('pdf');
           res.end(buffer, 'binary');
         });
       }   
     });
   }
  });
});

module.exports = router;