const express=require('express');
const multer=require('multer');
const ejs=require('ejs');
const path =require('path');

//set storage engine
const storageEngine=multer.diskStorage({
    destination: './public/upload/',
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' +Date.now() +
        path.extname(file.originalname));
    }
});
//init upload
const upload=multer({
    storage: storageEngine,limits:{fileSize:10000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('myImage');

//check file type
function checkFileType(file,cb){
    const filetypes=/jpeg|jpg|png|gif/;
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype=filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb('Error: Image only');
    }

}


const app=express();

//ejs
app.set('view engine','ejs');

//public folder
app.use(express.static('./public'));

//router
app.get('/', (req,res)=>res.render('index'));

app.post('/upload',(req,res)=>{
 upload(req,res,(err) =>
  {    
      if(err){
         res.render('index',{msg:err});
      }else{
          if(req.file==undefined){
              res.render('index',{
                  msg: 'Error:no file selected'
              });
          }else{

              res.render("index",{ 
                  
                  msg:'file uploaded',
                  
                  file: `upload/${req.file.filename}`
              });
          }
      }
  });
});



const port=4000;
app.listen(port ,()=> console.log(`server is running on port ${port}`));