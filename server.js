

import express from 'express'
import writeData from "./src/routes/writeSMSData.js"
import sendTestMessage from "./src/routes/sendTestMessage.js"
import lastGroupNum from "./src/routes/lastGroupNum.js"
import sendSMSMessages from "./src/routes/sendSMSMessage.js"
import cors from 'cors';
import 'dotenv/config';
import process from 'process';

const app = express();

const port = process.env.EXPRESS_PORT || 5173;

app.use(cors());
app.use(express.json());

app.post('/sendTestMessage', sendTestMessage);
app.get('/lastGroupNum',lastGroupNum)
app.post('/writeSMSData', writeData)
app.post('/sendSMSMessages', sendSMSMessages )

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
