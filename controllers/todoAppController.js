require('dotenv').config()
const Task = require("../models/TodoApp")
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
});


//base link welcome API users
exports.index = (req, res) => {
    return res.status(200).send({
        message: "Welcome to the SmartIQ Todo App. Please use the routes to perform your actions." //welcome mesage
    });
}

//create a new task
/*
_____IMPLEMENTATION___
POST METHOD
{
    "title": "Task 2 now",
    "description": "I am starting my new task as the first."
    "emailtonotify": "adelabutobi@gmail.com"
}
*/
exports.addTask = (req, res) => {
    //check if the description is not empty
    if (req.body.description.length < 1) {
        return res.status(400).send({
            message: "Please insert a task." //return error message
        });
    }
    // Create a new instance of task
    let newTaskTitle = `Untitled Task` //Add a task name if title is empty
    if (req.body.title.length > 0) newTaskTitle = req.body.title

    const newTask = new Task({
        title: newTaskTitle,
        description: req.body.description
    });

    newTask.save()
        .then(data => {
            let mailStatus = "";
            if (req.body.emailtonotify) { //send notification mail to user for new task if email was provided
                mailStatus = "Email notification sent successfully.";
                let mailOptions = { //set content of the mail
                    from: process.env.MAIL_USERNAME,
                    to: req.body.emailtonotify,
                    subject: `A new task, ${newTaskTitle}, has been created`,
                    text: `Here is what you wish to do "${req.body.description}"`
                };
                transporter.sendMail(mailOptions, function (mailerr, maildata) { //send mail to user
                    if (mailerr) { //catch errors
                        mailStatus = "Could not send email notification."
                    }
                });
            }
            return res.status(200).send({
                message: `New task created successfully! ${mailStatus}`
            })
        }).catch(err => {
            res.status(500).send({
                message: "Error occurred while adding a new task."
            });
            console.log(err)
        });
}

//fetch all tasks
/*
_____IMPLEMENTATION___
GET METHOD

*/
exports.fetchTasks = (req, res) => {
    Task.find() //fetch tasks
        .then(tasks => {
            res.status(200).send(tasks); //pass tasks into JSON
        }).catch(err => {
            res.status(500).send({
                message: "Error occurred while fetching tasks." //error message
            });
        });
}

//fetch a task
/*
_____IMPLEMENTATION___
GET METHOD
Unique Parameter: id
*/
exports.fetchTask = (req, res) => {
    Task.findById(req.params.id) //find task by ID
        .then(taskData => {
            if (!taskData) {
                return res.status(404).send({
                    message: "Task not found" //not found error message
                });
            }
            res.status(200).send(taskData); //pass the task into JSON
        }).catch(error => { //catch errors
            if (error.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Task could not be found" //not found error message
                });
            }
            return res.status(500).send({
                message: "Error occurred while fetching task." //error message
            });
        });
}

//update a task
/*
_____IMPLEMENTATION___
POST METHOD
{
    "title": "Task 2 now",
    "description": "I am starting my new task as the first."
}
*/
exports.updateTask = (req, res) => {
    console.log("delete todo")
    //check if the description is not empty
    if (req.body.description.length < 1) {
        return res.status(400).send({
            message: "Please insert a description." //return error message
        });
    }
    // Incase task name is empty
    let TaskTitle = `Untitled Task` //Add a task name if title is empty
    if (req.body.title.length > 0) TaskTitle = req.body.title

    // Find and update task
    Task.findByIdAndUpdate(req.params.id, {
            title: TaskTitle,
            description: req.body.description
        }, {
            new: true
        })
        .then(taskData => {
            if (!taskData) {
                return res.status(404).send({
                    message: "Task not found" //not found error message
                });
            }
            return res.status(200).send({
                message: "Task updated successfully!" //success message
            });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Task not found" //not found error message
                });
            }
            return res.status(500).send({
                message: "Error! cannot update task"
            });
        });
}

//delete a task
/*
_____IMPLEMENTATION___
DELETE METHOD
Unique Parameter: id
*/
exports.deleteTask = (req, res) => {
    Task.findByIdAndRemove(req.params.id) //find task by ID
        .then(taskToDel => {
            if (!taskToDel) {
                return res.status(404).send({
                    message: "Task not found." //not found error message
                });
            }
            res.status(200).send({
                message: "Task deleted successfully!" //success message
            });
        }).catch(error => {
            if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                return res.status(404).send({
                    message: "Task not found." //not found error message
                });
            }
            return res.status(500).send({
                message: "Error deleting task." // 500 error message
            });
        });
}