import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create transporter (stub for now)
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const message = {
    from: `${process.env.FROM_NAME || 'MentoraX'} <${process.env.FROM_EMAIL || 'noreply@mentorax.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html || options.message
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.log('Email error: ', error);
    throw error;
  }
};

export default sendEmail;