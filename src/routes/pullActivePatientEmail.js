
import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import 'dotenv/config';
import process from 'process';

const router = express();

router.use(cors());
router.use(express.json());

// TWILIO CREDS

// Database configuration
const dbConfig = {

    // TEST SERVER CREDENTIALS

    server: process.env.REACT_APP_DB_SERVER_TEST,
    port: parseInt(process.env.REACT_APP_DB_PORT_TEST),
    user: process.env.REACT_APP_DB_USER_TEST,
    password: process.env.REACT_APP_DB_PASSWORD_TEST,
    encrypt: true,
    trustServerCertificate: true,
 
}


// Endpoint to query the database
router.get('/pullActivePatientEmail', async (req, res) => {
    try {
        // Connect to the database (CHANGE QUERY IN PROD)
        let pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT DISTINCT email as activePatientEmail FROM MISC.dbo.vwActive_Patients');

        // Send the result to the client
        res.json(result.recordset[0]);
          
    } catch (err) {
                 console.error('Error retreiving active patients:', err);
        res.status(500).send('Server Error');
    }
});
 

export default router;