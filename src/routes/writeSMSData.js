
import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import 'dotenv/config';
import process from 'process';


const router = express();


router.use(cors());
router.use(express.json());

const dbConfig = {
        
        
    // TEST SERVER CREDENTIALS

    server: process.env.DB_SERVER_TEST,
    port: parseInt(process.env.DB_PORT_TEST),
    user: process.env.DB_USER_TEST,
    password: process.env.DB_PASSWORD_TEST,
    encrypt: true,
    trustServerCertificate: true,
}

router.post('/writeSMSData', async(req,res) => {

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
)

export default router;