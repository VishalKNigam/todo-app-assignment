const express = require("express");
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const validateRegisterInput = require("../validation/registerValidation");
const requiresAuth = require("../middlewares/permission.middleware");
require("dotenv").config();
UserRouter.get("/test", (req, res) => {
    res.send("Auth route working");
});
UserRouter.post("/register", async (req, res) => {
    try {
        const { errors, isValid } = validateRegisterInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        // check the existing user
        const existingEmail = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i"),
        });
        if (existingEmail) {
            return res.status(400).json({
                "error":
                    "There is already a user with this email"
            });
        };
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        //create a new user
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,
        });
        const savedUser = await newUser.save();
        const payload = { userId: savedUser._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("access-token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        const userToReturn = { ...savedUser._doc };
        delete userToReturn.password;
        return res.json(userToReturn);

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});
UserRouter.post("/login", async (req, res) => {
    try {
        // check for the user
        const user = await UserModel.findOne({
            email: new RegExp("^" + req.body.email + "$", "i"),
        });

        if (!user) {
            return res
                .status(400)
                .json({ error: "There was a problem with your login credentials" });
        }

        const passwordMatch = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!passwordMatch) {
            return res
                .status(400)
                .json({ error: "There was a problem with your login credentials" });
        }

        const payload = { userId: user._id };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("access-token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        const userToReturn = { ...user._doc };
        delete userToReturn.password;

        return res.json({
            token: token,
            user: userToReturn,
        });
    } catch (err) {
        console.log(err);

        return res.status(500).send(err.message);
    }
});;
UserRouter.get("/current", requiresAuth, (req, res) => {
    if (!req.user) {
        return res.status(401).send("Unauthorized");
    }
    return res.json(req.user);
});
UserRouter.put("/logout", requiresAuth, async(req,res)=>{
    try {
        res.clearCookie("access-token");
        return res.json({success: true});
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
})
module.exports = UserRouter;
