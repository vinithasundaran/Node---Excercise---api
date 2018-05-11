const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    firstName : {
        type : String,
        minlength : 1,
    },
    lastName : {
        type : String,
        minlength : 1
    },
    email : {
        type : String,
        trim : true,
        minlength  :1,
        unique :true,
        validate: {
            validator:validator.isEmail,
            message: '{VALUE} is not valid'
        }

    },
    password : {
        type : String,
        minlength : 6 
    },
    tokens : [{
        access : {
            type : String,
        },
        token : {
            type : String,
        }
    }]
});

// UserSchema.pre('save',function (next){
//     var user = this;
    
//     if(user.isModified('password')) {
//         bcrypt.genSalt(10,(error,salt) =>{
//             bcrypt.hash(password,salt,(error,hash)=>{
//                 user.password = hash;
//                 next();
//             });
//         });
//     }else {
//         next();
//     }

// });
// UserSchema.methods.toJSON = function () {
//     var user = this;
//     var userObject = user.toObject();
//     return _.pick(userObject,['_id','email']);
// };


UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = "auth";
    var token = jwt.sign({
        _id : user._id.toHexString(),
        access
    }, "secret").toString();
    user.tokens = user.tokens.concat([{access,token}]);

    return user.save().then(() =>{
        return token;
    });
};



UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token,"secret");
    } catch (e) {

    };
    return User.findOne({
        'id': decoded._id,
        'token' : token,
        'auth' : 'auth'
    });

};


var User = mongoose.model('User', UserSchema);


module.exports = {
    User
}
