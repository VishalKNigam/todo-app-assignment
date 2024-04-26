const express = require("express");
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
UserRouter.get("/test", (req,res)=>{
    res.send("Auth route working");
});
UserRouter.post("/register", async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
})