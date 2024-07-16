import express from "express";
import cors from "cors";
import "dotenv/config";
import process from "process";
import twilio from "twilio";
import { bulkInsertSMS } from '../utils/bulkInsertSMS.js'

const router = express();

router.use(cors());
router.use(express.json());

const accountSid = process.env.REACT_APP_ACCOUNT_SID_TEST;
const authToken = process.env.REACT_APP_AUTH_TOKEN_TEST;
const twilioPhone = process.env.REACT_APP_TWILIO_PHONE_NUMBER_TEST;
const client = twilio(accountSid, authToken);



router.post("/sendSMSMessages", async (req, res) => {
  try {

    const { rows } = req.body.rows;
    const { messageBody } = req.body.messageBody;
    const insertGroupNum = req.body.insertGroupNum;
    const groupName = req.body.groupName;

    let messageResults = [];


    if (!rows) {
      return res
        .status(400)
        .send("Missing required parameters: rows (cell_phone)");
    }

    if (!messageBody) {
      return res.status(400).send("Missing required parameters: messageBody");
    }

    
    // Example logic to send messages (adjust based on your implementation)
    for (let i = 0; i < (rows.length - 1); i++) {
    
      const phoneNumber = rows[i].cell_phone;
      console.log(`current phone number: ${phoneNumber}`)

      // for testing : console.log(`Sending message: ${phoneNumber}`)
      try {
        let messageResult = await client.messages.create({
          body: messageBody,
          from: twilioPhone,
          to: phoneNumber,
        });

        // destructure the response for each message
        const { status } = messageResult;
          
        // remove status === queued in prod

        if(status === 'queued' || status === 'sent' || status === 'delivered'){
          messageResults.push({
            phoneNumber: phoneNumber,
            f_sent: 1,
            body: messageBody
          })
        }

        console.log(`message result: ${status}`);
      } catch (error) {
        console.error(`Error sending message to ${phoneNumber} : ${error}`);

        messageResults.push({
          phoneNumber: phoneNumber,
          f_sent: 0,
          body: messageBody
        })

      }
    }

    const rowsWritten = bulkInsertSMS(messageResults, rows, messageBody, insertGroupNum, groupName)
    res.status(200).json({ success: true, rowsWritten: {rowsWritten}  });


  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to send messages",
        error: error.message,
      });
  }
});

export default router;
