const mongodb = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');



const schema = new mongodb.Schema({
    email:{
        type: String,
        required:[true,'please fill the email box'],
        unique:true,
        lowercase:true,
        validate:[isEmail, 'Email not Valide']
    },
    password:{
        type:String,
        required:[true,'please enter the password'],
        minlength:[6,'minimum password length is 6 character']
    },
});
schema.pre('save', async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password , salt);
    next();
    
});
schema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error ('incorrect email');
}




const user = mongodb.model('user',schema);

module.exports=user;
