const mongoose = require("mongoose");
const ToDoSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    complete: { type: Boolean, default: false },
    completedAt: { type: Date }
}, { timestamps: true });
const TodoModel = mongoose.model("ToDo", ToDoSchema);
module.exports = { TodoModel };