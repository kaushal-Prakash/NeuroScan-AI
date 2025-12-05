import nodemailer from 'nodemailer';

// configure transporter
const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL,      
    pass: process.env.GMAIL_PASS,          
  }
});

export default mailTransporter;
