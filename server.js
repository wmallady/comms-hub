/*
import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import 'dotenv/config';
import process from 'process';
import twilio from 'twilio'

const app = express();
const port = process.env.EXPRESS_PORT || 5173;

app.use(cors());
app.use(express.json());

// TWILIO CREDS
const accountSid = process.env.ACCOUNT_SID_TEST
const authToken = process.env.AUTH_TOKEN_TEST
const twilioPhone = process.env.TWILIO_PHONE_NUMBER_TEST
const client = twilio(accountSid, authToken);

// Database configuration
const dbConfig = {
        
        
    // TEST SERVER CREDENTIALS

    server: process.env.DB_SERVER_TEST,
    port: parseInt(process.env.DB_PORT_TEST),
    user: process.env.DB_USER_TEST,
    password: process.env.DB_PASSWORD_TEST,
    encrypt: true,
    trustServerCertificate: true,
 
}


// Endpoint to query the database
app.get('/lastGroupNum', async (req, res) => {
    try {
        // Connect to the database
        let pool = await sql.connect(dbConfig);
        const result = await pool.request().query('select max(insertgroup) as lastGroupNum from [model].[dbo].[GH_Process_MassText]');

        // Send the result to the client
        res.json(result.recordset[0]);
          
    } catch (err) {
                 console.error('Database query error:', err);
        res.status(500).send('Server Error');
    }
});

app.post('/sendTestMessage', async(req,res) => {

        const { toPhone, messageBody} = req.body;
    
        try {
                client.messages.create({
                body: messageBody,
                from: twilioPhone,
                to: toPhone,
            });
            res.status(200).send('success')
        } catch (error) {
            console.error("Error sending Twilio message:", error);
            res.sendStatus(500).send('Failed to send message ::: ', error)
        }
});


app.post('/writeData', async(req,res) => {

            const filteredRows = req.body.filteredRows;

            console.log('Writing to database...');
        
            try {
                await sql.connect(dbConfig)
                // Create a new bulk object
                // TEST TABLE NAME:: 
                const bulk = new sql.Table('model.dbo.GH_Process_MassText');
                // Define the schema for the table
                bulk.columns.add('InsertGroup', sql.Int, { nullable: true });
                bulk.columns.add('GroupName', sql.NVarChar(50), {nullable: true});
                bulk.columns.add('Phase', sql.Int, {nullable: true});
                bulk.columns.add('f_sent', sql.Bit, {nullable: true});
                bulk.columns.add('created_timestamp', sql.DateTime, {nullable: true});
                bulk.columns.add('start_sendDate', sql.DateTime, {nullable: true});
                bulk.columns.add('person_id', sql.UniqueIdentifier, {nullable: true});
                bulk.columns.add('first', sql.VarChar(100), {nullable:true});
                bulk.columns.add('last', sql.VarChar(100), {nullable:true});
                bulk.columns.add('cell_phone', sql.VarChar(12), {nullable: true});
                bulk.columns.add('month', sql.Int, {nullable:true});
                bulk.columns.add('sendDate', sql.DateTime, {nullable:true});
                bulk.columns.add('DOB', sql.DateTime, {nullable:true});
                bulk.columns.add('mem_nbr', sql.VarChar(30), {nullable:true});
                bulk.columns.add('txt_msg', sql.VarChar, {nullable:true});
            
                // Add rows to the bulk object
                filteredRows.forEach(row => {
                    bulk.rows.add(row['InsertGroup'], 
                    row["GroupName"], 
                    row['Phase'], 
                    row['f_sent'], 
                    row['created_timestamp'], 
                    row['start_sendDate'], 
                    row['person_id'], 
                    row['first'], 
                    row['last'], 
                    row['cell_phone'], 
                    row['month'], 
                    row['sendDate'], 
                    row['DOB'], 
                    row['mem_nbr'], 
                    row['txt_msg']);
                });
        
                const request = new sql.Request();
        
                // bulk sql request returns an item which we can use to find the number of rows that have been written
                const result = await request.bulk(bulk);
        
                // This deconstructor gives you the number of rows that were written. 
                res.json({ rowsAffected : result.rowsAffected})
            } catch (error) {
                console.error(error)
                res.status(500).send('Server Error');
                
            } finally {
                sql.close();
            }
        }
)*/

import express from 'express'
import writeData from "./src/routes/writeSMSData.js"
import sendTestMessage from "./src/routes/sendTestMessage.js"
import lastGroupNum from "./src/routes/lastGroupNum.js"
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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
