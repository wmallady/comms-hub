import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Papa from "papaparse";
import Popup from "reactjs-popup";

import { getDateStrings } from "../utils/utils.js";

const SMS = () => {
  const [subject, setSubject] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [body, setBody] = useState("");
  const [fileName, setFileName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [insertGroupNum, setInsertGroupNum] = useState(0);

  const [rows, setRows] = useState([]);

  const [pastInsertGroupNum, setPastInsertGroupNum] = useState([]);
  const [testEmail, setTestEmail] = useState([]);

  const [messageStatus, setMessageStatus] = useState("");
  const [open, setOpen] = useState(false);

  //Setters

  const changeGroupName = (event) => {
    setGroupName(event.target.value);
  };

  const changeInsertGroupNumber = (event) => {
    setInsertGroupNum(event.target.value);
  };

  const changeSubject = (e) => {
    setSubject(e.target.value);
  };

  // PAPA PARSE info (CSV Parsing)

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      //config options
      header: true,
      delimiter: ",",
      newline: "", // auto-detect
      quoteChar: '"',
      escapeChar: '"',
      encoding: "",
      worker: false,
      comments: false,
      //functions once it's complete
      complete: (parsed) => {
        // Assuming parsed.data is an array of rows from the CSV
        console.log(parsed.data);
        setRows(parsed.data);

        setFileName(file.name);

        e.target.value = null;
      },
      //
      error: (error) => {
        console.error("Error parsing CSV:", error);
        // Handle error state if needed
      },
    });
  };

  const changeTestEmail = (e) => {
    setEmailAddress(e.target.value);
  };
  // handlers for SMS

  const handleSendTestEmail = async (emailAddress, subject, body) => {
    try {
      const response = await fetch("http://localhost:5173/sendTestEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: emailAddress,
          subject: subject,
          body: body,
        }),
      });
      if (!response.ok) {
        setMessageStatus("Error in sending test email");
        throw new Error("Failed to send test email.");
      }
      return response.text();
    } catch (error) {
      console.error("Error sending email:", error);
      throw error; // Re-throw the error to handle it in the calling function if needed
    }
  };

  const handleSendMassEmail = async (rows, subject, body) => {
    try {
      const response = await fetch("http://localhost:5173/sendMassEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rows: { rows },
          subject: subject,
          body: body,
        }),
      });
      if (!response.ok) {
        setMessageStatus("Error in Sending Messages");
        throw new Error("Failed to send SMS.");
      }
      return response.text();
    } catch (error) {
      console.error("Error sending SMS:", error);
      throw error; // Re-throw the error to handle it in the calling function if needed
    }
  };

  const handleSendEmailClick = async () => {
    // gives popup with message status
    setOpen(true);
    setMessageStatus("Sending messages...");
    // add progress bar here later

    try {
      const result = await handleSendMassEmail(rows, subject, body);
      console.log(`Message result: ${result}`);
      setMessageStatus("Messages sent successfully");
    } catch (error) {
      setMessageStatus("Error sending messages");
      console.error("Error sending messages:", error);
    }
  };

  /* call it from a seperate function so we can pop up modal and adjust the message status */

  const handleTestEmailClick = async () => {
    try {
      setOpen(true);
      const result = await handleSendTestEmail(emailAddress, subject, body);
      setMessageStatus(`TEST MESSAGE - ${result}`);
    } catch (error) {
      setMessageStatus(`TEST MESSAGE - ${error}`);
    }
  };

  //get past insert group
  useEffect(() => {
    fetch("http://localhost:5173/lastEmailGroupNum")
      .then((response) => response.json())
      .then((data) => {
        setPastInsertGroupNum(data.lastGroupNum); // Assuming your server returns an object with a property `lastGroupNum`
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setPastInsertGroupNum("Error"); // Handle error state if needed
      });
  }, []);

  // SMS page elements
  return (
    <div>
      <div id="mainContainer">
        <div className="smallContainer">
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileIcon />}
            sx={{ marginRight: "1rem" }}
          >
            Select Contacts CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileUpload}
            />
          </Button>

          <span id="csvSpan"> Selected CSV ::: {fileName} </span>
        </div>
        <div className="smallContainer">
          <label htmlFor="groupNumberInput">
            Enter a Group Number (Most Recent is:{" "}
            {pastInsertGroupNum === null ? "Loading..." : pastInsertGroupNum}){" "}
          </label>
          <input
            type="text"
            id="groupNumberInput"
            placeholder="Group Number Goes Here..."
            value={insertGroupNum}
            onChange={changeInsertGroupNumber}
          ></input>
          <label htmlFor="groupNameInput">Enter a Group Name ::: </label>
          <input
            type="text"
            id="groupNameInput"
            placeholder="Group Name Goes Here..."
            value={groupName}
            onChange={changeGroupName}
          ></input>
        </div>
        <div className="smallContainer">
          <label htmlFor="testEmailInput">
            Enter A Test Email Address Here :::
          </label>
          <input
            id="testEmailInput"
            placeholder="john@doe.com"
            value={emailAddress}
            onChange={changeTestEmail}
          />
          <button id="testEmailButton" onClick={handleTestEmailClick}>
            Send Test Email
          </button>
          <Popup open={open} onClose={() => setOpen(false)} modal nested>
            {(close) => (
              <div className="modal">
                <button className="close" onClick={close}>
                  &times;
                </button>
                <div id="messageStatusDiv">
                  Message Status :::
                  <br></br>
                  {messageStatus}
                </div>
              </div>
            )}
          </Popup>
        </div>
        <div className="smallContainer">
          <label htmlFor="subjectInput">Enter your Subject ::: </label>
          <textarea
            id="subjectInput"
            value={subject}
            onChange={changeSubject}
          ></textarea>

          <button id="sendEmailsButton" onClick={handleSendEmailClick}>
            Send Message
          </button>
        </div>
        <div className="previewContainer">
          <label htmlFor="previewTable">Data Preview</label>

          <table id="previewTable" cellPadding="2" cellSpacing="0">
            <thead>
              <tr>
                <th>InsertGroup</th>
                <th>GroupName</th>
                <th>month</th>
                <th>html</th>
                <th>title</th>
                <th>sendDate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{insertGroupNum}</td>
                <td>{groupName}</td>
                <td>{getDateStrings().month}</td>
                <td>{fileName}</td>
                <td>{subject}</td>
                <td>{getDateStrings().timestamp}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SMS;
