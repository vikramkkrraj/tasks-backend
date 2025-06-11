const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema( {
    title : String,
    description : String,
    dueData : Date,
    status : { type : String, enum : ['pending', 'completed'], default : "pending"},
    createdBy : { type : mongoose.Schema.Types.ObjectId, ref : 'User'},
    assignedTo : { type : mongoose.Schema.Types.ObjectId, ref : "User"},
});

module.exports = mongoose.model("Task", taskSchema);
