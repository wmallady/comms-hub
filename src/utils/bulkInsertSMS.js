import sql from "mssql";
import { getDateStrings } from "./utils.js";

const dbConfig = {
  server: process.env.REACT_APP_DB_SERVER_TEST,
  port: parseInt(process.env.REACT_APP_DB_PORT_TEST),
  user: process.env.REACT_APP_DB_USER_TEST,
  password: process.env.REACT_APP_DB_PASSWORD_TEST,
  database: process.env.REACT_APP_DB_DATABASE_TEST,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export const bulkInsertSMS = async (
  messageResult,
  rows,
  messageBody,
  insertGroupNum,
  groupName
) => {
  let filteredRows = [];

  if (!rows || rows.length === 0) {
    console.error("Data Mapping Error: No data present to map...");
    return;
  }

  rows.forEach((row, index) => {
    row["month"] = getDateStrings().month;
    row["start_sendDate"] = getDateStrings().timestamp;
    row["sendDate"] = getDateStrings().timestamp;
    row["created_timestamp"] = getDateStrings().timestamp;
    row["txt_msg"] = messageBody;

    messageResult.f_sent = '1' ? row['f_sent'] = 1 : row['f_sent'] = 0

    const validData =
      row["first"] && row["last"] && row["cell_phone"] && row["DOB"];

    if (validData) {
      const {
        InsertGroup,
        GroupName,
        Phase,
        f_sent,
        created_timestamp,
        start_sendDate,
        sendDate,
        month,
        person_id,
        first,
        last,
        cell_phone,
        DOB,
        mem_nbr,
        txt_msg,
      } = row;
      filteredRows.push({
        InsertGroup,
        GroupName,
        Phase,
        f_sent,
        created_timestamp,
        start_sendDate,
        sendDate,
        month,
        person_id,
        first,
        last,
        cell_phone,
        DOB,
        mem_nbr,
        txt_msg,
      });
    } else {
      console.error(
        `Data Mapping Error: Invalid data present in row #: ${index + 1}`
      );
    }
  });

  const pool = await sql.connect(dbConfig);

  try {
    const bulk = new sql.Table("model.dbo.GH_Process_MassText");

    // Define columns
    bulk.columns.add("InsertGroup", sql.Int, { nullable: true });
    bulk.columns.add("GroupName", sql.NVarChar(50), { nullable: true });
    bulk.columns.add("Phase", sql.Int, { nullable: true });
    bulk.columns.add("f_sent", sql.Bit, { nullable: true });
    bulk.columns.add("created_timestamp", sql.DateTime, { nullable: true });
    bulk.columns.add("start_sendDate", sql.DateTime, { nullable: true });
    bulk.columns.add("person_id", sql.UniqueIdentifier, { nullable: true });
    bulk.columns.add("first", sql.VarChar(100), { nullable: true });
    bulk.columns.add("last", sql.VarChar(100), { nullable: true });
    bulk.columns.add("cell_phone", sql.VarChar(12), { nullable: true });
    bulk.columns.add("month", sql.Int, { nullable: true });
    bulk.columns.add("sendDate", sql.DateTime, { nullable: true });
    bulk.columns.add("DOB", sql.DateTime, { nullable: true });
    bulk.columns.add("mem_nbr", sql.VarChar(30), { nullable: true });
    bulk.columns.add("txt_msg", sql.VarChar, { nullable: true });

    // Add rows
    filteredRows.forEach((row) => {
      const { InsertGroup, GroupName, Phase, f_sent, created_timestamp, start_sendDate, person_id, first, last, cell_phone, month, sendDate, DOB, mem_nbr, txt_msg } = row;
      
      bulk.rows.add(
        InsertGroup || insertGroupNum, // InsertGroup
        GroupName || groupName, // GroupName
        Phase || null,
        f_sent,
        created_timestamp,
        start_sendDate,
        person_id || null,
        first,
        last,
        cell_phone,
        month,
        sendDate,
        DOB,
        mem_nbr || null,
        txt_msg
      );
    });

    // Execute bulk insert
    const request = pool.request();
    const { rowsAffected } = await request.bulk(bulk);

    console.log(`${rowsAffected} rows written to database`);
  } catch (error) {
    console.error("Error inserting data into the database:", error);
  } finally {
    pool.close();
  }
};

export default bulkInsertSMS;
