import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import nodemailer from 'nodemailer';

const router = express.Router();

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

router.post('/sendMassEmail', async (req, res) => {
  const { rows, subject, body, attachments } = req.body;

  if (!rows || !subject || !body) {
    return res.status(400).send('Missing required parameters: rows, subject, and/or body');
  }

  try {
    for (let i = 0; i < rows.length; i++) {
      const mailOptions = {
        from: process.env.REACT_APP_FROM_EMAIL,
        to: rows[i].activePatientEmail,
        subject: subject,
        html: body,
        attachments: attachments,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).send('Emails sent successfully!');
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).send(`Failed to send emails: ${error.message}`);
  }
});

export default router;
