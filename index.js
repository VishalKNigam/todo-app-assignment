const express = require("express");
const { connection } = require("./db");
const UserRouter = require("./routes/user.route");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use("/api/auth".UserRouter);
app.get("/", (req, res) => {
    res.send({ msg: "Add your task, Manage your task. I am here to assist you!😊" });

});
app.listen(process.env.PORT, async()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
    try {
        await connection;
        console.log("Connected to the DB Succcessful!")
    } catch (error) {
        console.log("error during connection to DB", error);
    }
});