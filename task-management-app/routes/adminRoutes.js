const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const {
  getAllTasks, updateTask, deleteTask, tasksGroupedByUser, tasksGroupedByCompletion
} = require('../controllers/taskController');
const { getAllUsers } = require('../controllers/userController');

router.use(auth, role(['admin']));

router.get('/tasks', getAllTasks);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.get('/tasks/grouped-by-user', tasksGroupedByUser);
router.get('/tasks/grouped-by-completion', tasksGroupedByCompletion);
router.get('/users', getAllUsers);

module.exports = router;
