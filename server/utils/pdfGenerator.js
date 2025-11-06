import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export const generateCertificate = async (user, course, score) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
      const certificateId = uuidv4();
      const verificationUrl = `${process.env.CLIENT_URL}/verify/${certificateId}`;
      
      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(verificationUrl);
      const qrCodeBuffer = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');

      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve({
          pdfBuffer: pdfData,
          certificateId,
          verificationUrl,
          qrCodeDataURL
        });
      });

      // Certificate design
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');
      
      // Border
      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
         .stroke('#2563eb')
         .lineWidth(3);

      // Header
      doc.fontSize(36)
         .fillColor('#1e40af')
         .text('CERTIFICATE OF COMPLETION', 0, 100, { align: 'center' });

      doc.fontSize(16)
         .fillColor('#64748b')
         .text('This is to certify that', 0, 160, { align: 'center' });

      // Student name
      doc.fontSize(28)
         .fillColor('#0f172a')
         .text(user.name, 0, 200, { align: 'center' });

      doc.fontSize(16)
         .fillColor('#64748b')
         .text('has successfully completed the course', 0, 250, { align: 'center' });

      // Course title
      doc.fontSize(24)
         .fillColor('#1e40af')
         .text(course.title, 0, 290, { align: 'center' });

      // Score and grade
      const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : score >= 50 ? 'C+' : 'C';
      doc.fontSize(16)
         .fillColor('#64748b')
         .text(`Score: ${score}% | Grade: ${grade}`, 0, 350, { align: 'center' });

      // Date
      doc.fontSize(14)
         .text(`Issued on: ${new Date().toLocaleDateString()}`, 0, 390, { align: 'center' });

      // QR Code
      doc.image(qrCodeBuffer, doc.page.width - 150, doc.page.height - 150, { width: 100 });
      
      // Certificate ID
      doc.fontSize(10)
         .fillColor('#64748b')
         .text(`Certificate ID: ${certificateId}`, 50, doc.page.height - 80);

      // MentoraX branding
      doc.fontSize(20)
         .fillColor('#2563eb')
         .text('MentoraX', 50, doc.page.height - 120);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};