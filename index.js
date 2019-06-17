const express=require('express');
const morgan=require('morgan');
const parser=require('body-parser');
const mongoose =require('mongoose');
const bcryptjs = require('bcryptjs');
const engine = require('ejs-mate');
const port=3007;
const app=express();   

app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views','./views');
app.use(express.static('public')); 
app.use(morgan('dev'));
app.use(parser.json());
app.use(parser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://ankitabcd:abcd@cluster0-n6q81.mongodb.net/test?retryWrites=true&w=majority",function(err){
  if(err){ console.log(err);} else{ console.log('Atlas connected');}
});

var Schema=mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  gender:{type:String,required:true},
  contact:{type:Number,required:true},
  age:{type:Number,required:true},
  Issue:{type:String},
  Description:{type:String}
});
var Umodel = mongoose.model('Mentor',Schema);
var Mmodel = mongoose.model('User',Schema);

app.post('/mentorsignup', (req,res) => {
 
  var newMentor=new Mmodel ({
    _id:mongoose.Types.ObjectId(),
    name:req.body.name,
    email:req.body.email,
    password:req.body.password, //password:bcryptjs.hashSync(req.body.password,10),
    gender:req.body.gender,
    contact:req.body.contact,
    age:req.body.age
  });
 Mmodel.find({email:req.body.email})
  .exec()
  .then(mentor=>{
    if(mentor.length>0){
      
      //res.send("account already exists").status(400)
    }
    else{
 newMentor.save()
  res.redirect('/mentor.html');
}
 })
});


app.post('/usersignup',function(req,res){
 
    const newUser = new Umodel({
    _id: mongoose.Types.ObjectId(),
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,   // password:bcryptjs.hashSync(req.body.password,10),
    gender:req.body.gender,
    contact:req.body.contact,
    age:req.body.age
});

Umodel.find({email:req.body.email})
.exec()
.then(users=>{
    if(users.length>0){
        //res.send("Account already exists").status(400);
    }
    else{
        newUser.save();
        res.redirect('/user.html');
      }
  }) 
});


app.post('/loginMentor',function(req, res) {
  
  
    Mmodel.find({email:req.body.email})
    .exec()
    .then(mentors=>{
      if(mentors.length>0){
        Mmodel.findOne({password:req.body.password}, function(err,mentor){
          Umodel.find({},function(err,products){
            if(err){
              res.send(err);
            }
            else {
              res.render('mentordash',{products:products});
            }  
          }) 
      })
    }}) 
 });

   app.post('/loginUser',function(req, res) {
    
    
      Umodel.find({email:req.body.email})
      .exec()
      .then(users=>{
          if(users.length>0){
            Umodel.findOne({password:req.body.password}, function(err,mentor){
              if(err){
                    res.send(err);
                  }
                  if(!mentor) 
                  { res.send("not done");
                  }
                  else {
                    res.render('userdash',{inDash:users});
          }   

          })
        }}) 
     });



     app.put('/query', function(req,res) {
    
  
  const email = req.body.email;
  const Issue = req.body.Issue;
 
  const description = req.body.Description;
  Umodel.updateOne({email:email},{$set:{Issue:Issue}})
  .exec()
  Umodel.updateOne({email:email},{$set:{Description:description}})
  .exec()
  .then(result =>{
  res.send('Thank you for submitting.');
})
.catch(err => {
     res.status(400).send('unable to save to database');
   })
 });


//  router.post('/query', function(req, res) {
//   searchdata = req.body.searchbar;
//   res.end();
// });



 app.delete('/val',function(req,res){
 
  const v = req.body.val;
  console.log(v);
    Umodel.remove({_id:v})
    .exec()
    .then(result => {
    Umodel.find({},function(err,products){
  if(err){
    res.send(err);
  }
  else {
    // console.log(products)
    res.render('mentordash',{products:products});
  }  
  })
})
});


app.listen(port,function(){
  console.log(`Server listening on ${port}`);
});
   