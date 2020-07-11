import nodemailer from 'nodemailer';

const mailConfig = {
  host: process.env.MAIL_HOST,
  secure: false,
  port: process.env.MAIL_PORT,
  tls: {
    rejectUnauthorized: false,
  },
};

export default nodemailer.createTransport(mailConfig);
