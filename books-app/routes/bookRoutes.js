const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/books', bookController.getBooks);
router.post('/books', bookController.addBook);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);

router.post('/books/bulk', bookController.bulkInsertBooks);

module.exports = router;
