const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pass_local_mongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email :{
        type : String,
        required : true,
    }
});

userSchema.plugin(pass_local_mongoose);

module.exports = mongoose.model("User",userSchema);