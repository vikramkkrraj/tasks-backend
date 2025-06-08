const cron = require('cron');
const redisClient = require('../services/redisClient');
const { BULK_STATUS_KEY } = require('../controllers/bulkController');
const { generateReportPDF } = require('../services/pdfService');
const { sendMail } = require('../services/emailService');
const User = require('../models/User');

const reportEmailJob = new cron.CronJob('*/5 * * * *', async () => {
  try {
    console.log('Running report email job');

    const keys = await redisClient.keys('bulkStatus:user:*');

    for(const key of keys) {
      const userId = key.split(':')[2];
      const rawStatus = await redisClient.get(key);
      if(!rawStatus) continue;

      const status = JSON.parse(rawStatus);

      const user = await User.findById(userId);
      if(!user) {
        console.warn(`User ${userId} not found, skipping report email`);
        await redisClient.del(key);
        continue;
      }

      const pdfBuffer = await generateReportPDF(status);

      await sendMail(
        user.email,
        'Bulk Book Insertion Report',
        'Please find attached the bulk book insertion report.',
        [{ filename: 'bulk_report.pdf', content: pdfBuffer }]
      );

      console.log(`Report emailed to ${user.email}`);

      // Delete the status record after successful email
      await redisClient.del(key);
    }
  } catch(err) {
    console.error('Report email job error:', err);
  }
});

module.exports = { reportEmailJob };
