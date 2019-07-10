const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
        
    },
    username: {
        type: String,
        unique: true, 
        required: [true, "cannot be empty."],
         lowercase: true,
    },
    password: {
        type: String,
        required: [true, "cannot be empty."]
    },
    phone_no: {
        type: String,
        unique: true
    },
    permanent_address: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    gender: {
        type: String
    },
    image_name: {
        type: String
    },
    user_type:{
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.statics.checkCrediantialsDb = async (username, password) => {

    const user1 = await User.findOne({
        username: username,
        password: password
    }); //name and age are columns from model or database
if(user1){
   
    return user1;
}
    else{
        console.log(user1);
        return false;
    }
}

userSchema.methods.generateAuthToken = async function () { //generates token 
    const user = this;
    const token = await jwt.sign({
        _id: user._id.toString()
    }, 'thisismynewcourse');
    console.log(token);
    user.tokens = user.tokens.concat({
        token: token
    })
    await user.save();
    return token;
}

const User = mongoose.model('User', userSchema);
module.exports = User; //User= variable name