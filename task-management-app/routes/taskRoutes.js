const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const rateLimiter = require('../middlewares/rateLimiter');

const {
  createTask, getUserTasks, markCompleted, deleteTask } = require('../controllers/taskControllers');

router.post('/', auth, createTask);
router.get('/', auth, rateLimiter, getUserTasks);
router.patch('/:id/complete', auth, markCompleted);
router.delete('/:id', auth, deleteTask);

module.exports = router;