

import express from 'express'
import sendTestMessage from "./src/routes/sendTestMessage.js"
import lastGroupNum from "./src/routes/lastGroupNum.js"
import sendSMSMessages from "./src/routes/sendSMSMessage.js"
import sendTestEmail from "./src/routes/sendTestEmail.js"
import lastEmailGroupNum from './src/routes/lastEmailGroupNum.js'
import cors from 'cors';
import 'dotenv/config';
import process from 'process';

const app = express();

const port = process.env.EXPRESS_PORT || 5173;

app.use(cors());
app.use(express.json());

app.post('/sendTestMessage', sendTestMessage);
app.get('/lastGroupNum',lastGroupNum);
app.get('/lastEmailGroupNum', lastEmailGroupNum);
app.post('/sendSMSMessages', sendSMSMessages);
app.post('/sendTestEmail', sendTestEmail);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
