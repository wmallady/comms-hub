import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import nodemailer from 'nodemailer';

const router = express();

router.use(cors());
router.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.REACT_APP_EMAIL_HOST,
  port: process.env.REACT_APP_EMAIL_PORT,
  auth: {
    user: process.env.REACT_APP_EMAIL_UN,
    pass: process.env.REACT_APP_EMAIL_PW,
  },
});

router.post('/sendTestEmail', async (req, res) => {
  const { emailAddress, subject, body } = req.body;

  if (!emailAddress || !subject || !body) {
    return res.status(400).send('Missing required parameters: toEmail, subject, and/or messageBody');
  }

  const mailOptions = {
    from: process.env.REACT_APP_FROM_EMAIL,
    to: emailAddress,
    subject: subject,
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send(`Failed to send email: ${error.message}`);
  }
});

export default router;
