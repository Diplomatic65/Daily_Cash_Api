const nodemailer = require('nodemailer');
require('dotenv').config();

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
    pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,  // Use your App Password here
  },
  secure: true,  // Ensure SSL/TLS connection
});

module.exports = transport;