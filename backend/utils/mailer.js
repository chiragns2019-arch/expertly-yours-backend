const nodemailer = require('nodemailer');

// Cache ethereal account
let cachedEtherealAccount = null;

const sendEmailNotification = async (to, subject, text) => {
  try {
    let transporter;

    if (process.env.SMTP_USER && process.env.SMTP_USER !== 'ethereal.user@ethereal.email') {
      // Use User's Gmail / SMTP
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        service: process.env.SMTP_HOST ? undefined : 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Generate Ethereal Test credentials natively! "VERIFY WITH REAL DATA"
      if (!cachedEtherealAccount) {
        console.log("[DEBUG] Generating dynamic Ethereal email credentials for Testing...");
        cachedEtherealAccount = await nodemailer.createTestAccount();
      }
      transporter = nodemailer.createTransport({
        host: cachedEtherealAccount.smtp.host,
        port: cachedEtherealAccount.smtp.port,
        secure: cachedEtherealAccount.smtp.secure,
        auth: {
          user: cachedEtherealAccount.user,
          pass: cachedEtherealAccount.pass,
        },
      });
    }

    console.log(`[DEBUG] Mailer initializing send to ${to}...`);
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Expertly Yours" <noreply@expertlyyours.com>',
      to,
      subject,
      text,
    });
    
    console.log(`[DEBUG] ✅ Real Email successfully dispatched to ${to}: ${subject} (Message ID: ${info.messageId})`);
    
    // Natively verify test emails
    if (!process.env.SMTP_USER || process.env.SMTP_USER === 'ethereal.user@ethereal.email') {
      console.log(`[VERIFY-EMAIL] 🔗 View delivered test email here: ${nodemailer.getTestMessageUrl(info)}`);
    }

  } catch (error) {
    console.error(`[ERROR] ❌ Failed to send email to ${to}!`);
    console.error(`[EXACT ERROR]`, error.message);
  }
};

module.exports = {
  sendEmailNotification,
};
