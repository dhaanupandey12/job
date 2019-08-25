const express   = require("express"),
      mongoose  = require("mongoose"),
      ejs       = require("ejs"),
      fs        = require("fs"),
      pdf       = require("html-pdf");

var user = require('./user/User');
  PDFParser = require("pdf2json");
var router = express.Router();
router.get('/',(req,res)=>{



// let pdfParser = new PDFParser();
//
// pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
// pdfParser.on("pdfParser_dataReady", pdfData => {
//   fs.writeFile("./resume.json", JSON.stringify(pdfData));
// });
// res.send('dbjhdbjbjeb');
// pdfParser.loadPDF("./resume.pdf");

let pdfParser = new PDFParser(this,1);

    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
        fs.writeFile("./resume.txt", pdfParser.getRawTextContent());
    });

    pdfParser.loadPDF("./resume.pdf");
    res.send('dbjhdbjbjeb');

});


module.exports = router
