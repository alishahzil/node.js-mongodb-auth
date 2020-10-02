const jwt = require('jsonwebtoken');
const user = require('../model/model');

const requireAuth =(req,res,next)=>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token,'shahzil',(err,decodedtoken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }else{
                console.log(decodedtoken);
                next();
            }
        });
    }else{
        res.redirect('/login');
    }


}

module.exports = {requireAuth};
