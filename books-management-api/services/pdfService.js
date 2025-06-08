const PDFDocument = require('pdfkit');
const streamBuffers = require('stream-buffers');

async function generateReportPDF({ userId, successCount, failCount, timestamp }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const writableStreamBuffer = new streamBuffers.WritableStreamBuffer();

    doc.pipe(writableStreamBuffer);

    doc.fontSize(20).text('Bulk Book Insertion Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`User ID: ${userId}`);
    doc.text(`Date: ${new Date(timestamp).toLocaleString()}`);
    doc.text(`Books Inserted Successfully: ${successCount}`);
    doc.text(`Books Failed: ${failCount}`);

    doc.end();

    writableStreamBuffer.on('finish', () => {
      const buffer = writableStreamBuffer.getContents();
      if(!buffer) return reject(new Error('Failed to get PDF buffer'));
      resolve(buffer);
    });
  });
}

module.exports = { generateReportPDF };
