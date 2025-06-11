const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    const { title,description,dueData,assignedTo} = req.body;
    const task = await Task.create({
        title,
        description,
        dueData,
        createdBy : req.user._id,
        assignedTo
    });
    res.status(201).json(task);
};

exports.getUserTasks = async (req,res) => {
    const tasks = await Task.find({
        $or : [
            { createdBy : req.user._id},
            {assignedTo : req.user._id}
        ]
    })
    res.status(200).json(tasks);
}

exports.markCompleted = async (req,res) => {
    const task = await Task.findById(req.params.id);
    if(task.assignedTo.toString() != req.user._id.toString()){
        return res.status(403).json( { message : "Only assigned user can complete taks"});
    }
    task.status = "completed";
    await task.save();
    res.json({ message : "Task marked as completed"});
}

exports.deleteTask = async (req,res) => {
    const task = await Task.findById(req.params.id);
    if(task.createdBy.toString() != req.user._id.toString() && req.user.role !='admin') {
        return res.status(403).json({ message : "Only creator or admin can delete task"});
    }
    await task.deleteOne();
    res.status(200).json( { message : 'Task deleted'});
}

exports.updateTask = async (req,res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new : true})
    res.status(200).json({ message : "Task Updated", task});
}

exports.getAllTasks = async (req,res) => {
    const tasks = await Task.find();
    res.status(200).json(tasks);
};

exports.tasksGroupedByUser = async (req,res) => {
    const result = await Task.aggregate( [
        {
            $group : {
                _id : "$assignedTo", tasksAssigned : { $sum : 1}
            }
        },
         {
            $lookup : {
                from : "users",
                localField : "_id",
                foreignField : "_id",
                as : "user"
            }
         },
         { 
            $unwind : "$user"
         },
         {
            $project : {
                user : "$user.name" , tasksAssigned : 1
            }
         }

    ]);
    res.status(200).json(result)
}

exports.tasksGroupByCompletion = async (req,res) =>  {
     const result = await Task.aggregate([
        {
            $group : {
                _id : "$status",
                count : { $sum : 1 }
            }
        }
     ]);

     const output = {};
     result.forEach(r => {
    output[r._id === 'completed' ? 'completed' : 'notCompleted'] = r.count;
  });
  res.json(output);
}