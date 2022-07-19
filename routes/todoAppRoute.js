const express = require('express');
const router = express.Router();
const controller = require('../controllers/TodoAppController');

router.get('/', controller.index)
router.post('/addTask', controller.addTask) //add Tasks via POST
router.get('/fetchTasks', controller.fetchTasks) //fetch all Tasks via GET
router.get('/fetchTask/:id', controller.fetchTask) //fetch a Task via GET
router.put('/updateTask/:id', controller.updateTask) //update Task changes via PUT
router.delete('/deleteTask/:id', controller.deleteTask) //delete Task via DELETE
module.exports = router;