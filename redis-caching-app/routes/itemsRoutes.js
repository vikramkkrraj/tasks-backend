const express = require('express');
const router = express.Router();

const itemsController = require('../controllers/itemsController');

router.get('/items', itemsController.getItems);
router.post('/items', itemsController.addItem);
router.put('/items/:id', itemsController.updateItem);
router.delete('/items/:id', itemsController.deleteItem);

module.exports = router;
