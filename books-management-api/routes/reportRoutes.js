const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');

router.use(authMiddleware);

router.get('/status', reportController.getBulkStatus);
router.post('/send', reportController.sendReportNow);

module.exports = router;
