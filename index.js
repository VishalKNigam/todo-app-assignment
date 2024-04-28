const express = require("express");
const cookieParser = require("cookie-parser");
const { connection } = require("./db");
const UserRouter = require("./routes/user.route");
const TodoRouter = require("./routes/todo.route");
const path = require("path");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.get("/api", (req, res) => {
    res.send("Todo-app-assignment");
});

app.use("/api/auth", UserRouter);
app.use("/api/todos", TodoRouter);
app.use(express.static(path.resolve(__dirname, "./client/build")));
app.get("/", (req, res) => {
    res.send({ msg: "Add your task, Manage your task. I am here to assist you!😊" });

});
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});
app.listen(process.env.PORT, async () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
    try {
        await connection;
        console.log("Connected to the DB Succcessful!")
    } catch (error) {
        console.log("error during connection to DB", error);
    }
});