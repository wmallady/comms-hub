
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import process from 'process';
import twilio from 'twilio'

const router = express();

router.use(cors());
router.use(express.json());

const accountSid = process.env.ACCOUNT_SID_TEST
const authToken = process.env.AUTH_TOKEN_TEST
const twilioPhone = process.env.TWILIO_PHONE_NUMBER_TEST
const client = twilio(accountSid, authToken);

router.post('/sendTestMessage', async (req, res) => {
    const { toPhone, messageBody } = req.body;
  
    if (!toPhone || !messageBody) {
      return res.status(400).send('Missing required parameters: toPhone and messageBody');
    }
  
    try {
      await client.messages.create({
        body: messageBody,
        from: twilioPhone,
        to: toPhone,
      });
  
      res.status(200).send('Success');
    } catch (error) {
      console.error("Error sending Twilio message:", error);
      res.status(500).send(`Failed to send message: ${error.message}`);
    }
  });

export default router;