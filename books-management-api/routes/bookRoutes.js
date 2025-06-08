const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const bookController = require('../controllers/bookController');
const bulkController = require('../controllers/bulkController');

router.use(authMiddleware);

router.get('/', bookController.getBooks);
router.post('/', bookController.addBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

// Bulk insertion route
router.post('/bulk', bulkController.bulkInsert);

module.exports = router;
