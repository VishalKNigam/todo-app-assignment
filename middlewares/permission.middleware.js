const UserModel = require("../models/user.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const requiresAuth = async(req,res,next)=>{
    const token = req.cookies["access-token"];
    let isAuthed = false;
    if(token){
        try {
            const {userId} = jwt.verify(token, process.env.JWT_SECRET);
            try {
                const user = await UserModel.findById(userId);
                if(user){
                    const userToReturn = {...user._doc};
                    delete userToReturn.password;
                    req.user = userToReturn;
                    isAuthed = true;
                }
            } catch (error) {
                isAuthed = false;
            }
        } catch (error) {
            isAuthed = false
        }
    }else{
        return res.status(401).send("Unauthorized");
    }
}
module.exports = requiresAuth;