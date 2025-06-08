const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Only admin can create/update/delete dishes
router.post('/', authMiddleware, roleMiddleware(['admin']), dishController.createDish);
router.get('/', dishController.getAllDishes);
router.get('/:id', dishController.getDishById);
router.patch('/:id', authMiddleware, roleMiddleware(['admin']), dishController.updateDish);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), dishController.deleteDish);

module.exports = router;
