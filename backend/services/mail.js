import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.DUNAMYS_GMAIL_ADDRESS,
    pass: process.env.DUNAMYS_GMAIL_PASSWORD,
  },
});

export const sendEmail = async ({ recipient, subject, message }) => {
  return await transporter.sendMail({
    from: process.env.DUNAMYS_GMAIL_ADDRESS,
    to: recipient,
    subject,
    text: message,
    html: message,
  });
};
