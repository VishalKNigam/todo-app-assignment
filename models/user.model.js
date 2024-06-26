const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},

},{
    timestamps: true,
});
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;