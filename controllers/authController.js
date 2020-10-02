 const user = require('../model/model');
 const jwt = require('jsonwebtoken');




 const errorhandler = (err)=>{

    let errors = { email: '', password: '' };
    if(err.message.includes('incorrect email')){
      errors.email = 'Email address is not registered';
    }
    if(err.message.includes('incorrect password')){
      errors.password = 'Incorrect password';
    }
  
    if (err.code === 11000) {
      errors.email = 'Email is already registered';
      return errors;
    }
  
    if (err.message.includes('user validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
    
 }
 const maxage = 3*24*60*60;
 const createToken = (id) =>{
   return jwt.sign({id},'shahzil',{
     expiresIn:maxage

   });
 }
 

module.exports.signup_get = (req,res)=>{
    res.render('signup');
}

module.exports.login_get= (req,res) =>{
    res.render('login');
}
module.exports.signup_post =async (req,res) =>{
    const { email,password} = req.body;
    try{
        const users = await user.create({ email, password});
        const token = createToken(users.id);
        res.cookie('jwt',token,{httpOnly:true,maxage:maxage});
        res.status(201).json(users);
    }
    catch(err){
        const error = errorhandler(err);
        res.status(400).json({error});
    }
    res.send('new signup');
}
module.exports.login_post = async (req,res)=>{
  const {email,password} = req.body;
  try{
    const userlog = await user.login(email,password);
    const token = createToken(userlog.id);
    res.cookie('jwt',token,{httpOnly:true,maxage:maxage});
    res.status(200).json({user:userlog.id});
  } catch(err){
    const error = errorhandler(err);
  
    res.status(400).json({error});

  } 
}
module.exports.logout_get= (req,res)=>{
  res.cookie('jwt','',{maxage:1});
  res.redirect('/');
}