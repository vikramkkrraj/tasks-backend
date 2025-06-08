const redisClient = require('../services/redisClient');
const User = require('../models/User');
const { generateReportPDF } = require('../services/pdfService');
const { sendMail } = require('../services/emailService');
const { BULK_STATUS_KEY } = require('./bulkController');

/**
 * GET /api/report/status
 * Get the bulk insertion status for the current user.
 */
exports.getBulkStatus = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const raw = await redisClient.get(BULK_STATUS_KEY(userId));

    if (!raw) return res.status(404).json({ message: 'No status found for this user' });

    const status = JSON.parse(raw);
    return res.json(status);
  } catch (err) {
    console.error('Get bulk status error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * POST /api/report/send
 * Manually send the report email with attached PDF for the current user.
 */
exports.sendReportNow = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const raw = await redisClient.get(BULK_STATUS_KEY(userId));

    if (!raw) return res.status(404).json({ message: 'No bulk status found' });

    const status = JSON.parse(raw);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const pdfBuffer = await generateReportPDF(status);

    await sendMail(
      user.email,
      'Manual Bulk Book Insertion Report',
      'Attached is your manually triggered bulk book insertion report.',
      [{ filename: 'bulk_report.pdf', content: pdfBuffer }]
    );

    // Delete status after sending
    await redisClient.del(BULK_STATUS_KEY(userId));

    return res.json({ message: 'Report sent and status deleted' });
  } catch (err) {
    console.error('Send report error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
