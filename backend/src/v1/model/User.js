const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    full_name:{
        type: String,
        // required: true,
    },
    gmail:{
        type:String,
        default: null,
    },
    google_id:{
        type: String,
        default: null,
    },
    login_type:{
        type: String,
        default: null,
    },
    password:{
        type: String,
        default: null,
    },
    status:{
        type: Number,
        default: 0,
    },
},
{
    timestamps: true,
});
module.exports =  mongoose.model('User', userSchema);
