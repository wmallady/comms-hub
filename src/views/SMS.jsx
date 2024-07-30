import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Papa from "papaparse";
import Popup from "reactjs-popup";

import {
  /*filterData sendMessages, sendTwilioMessage*/
  getDateStrings,
  //sendSMS,
} from "../utils/utils.js";

const SMS = () => {
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [insertGroupNum, setInsertGroupNum] = useState(0);
  const [phase, setPhase] = useState(0);
  const [rows, setRows] = useState([]);

  const [insertGroupNumEnabled, setInsertGroupNumEnabled] = useState(true);
  const [groupNameEnabled, setGroupNameEnabled] = useState(true);
  const [phaseEnabled, setPhaseEnabled] = useState(true);

  const [pastInsertGroupNum, setPastInsertGroupNum] = useState([]);
  const [testPhoneNumber, setTestPhoneNumber] = useState([]);

  const [messageStatus, setMessageStatus] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [open, setOpen] = useState(false);

  //Setters

  const changeGroupName = (event) => {
    setGroupName(event.target.value);
  };

  const changeInsertGroupNumber = (event) => {
    setInsertGroupNum(event.target.value);
  };

  const changePhase = (event) => {
    setPhase(event.target.value);
  };

  const changeTestPhone = (event) => {
    setTestPhoneNumber(event.target.value);
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

        //Check if InsertGroup num is present
        const groupNumPresent = parsed.data.some((row) => row.InsertGroup);

        setInsertGroupNumEnabled(!groupNumPresent);

        //check if GroupName is present
        const groupNamePresent = parsed.data.some((row) => row.GroupName);
        setGroupNameEnabled(!groupNamePresent);

        //check is Phase is present
        const phasePresent = parsed.data.some((row) => row.Phase);
        setPhaseEnabled(!phasePresent);

        if (groupNamePresent) {
          const groupNameData = parsed.data.find((row) => row.GroupName);
          if (groupNameData) {
            setGroupName(groupNameData.GroupName);
          }
        }

        if (groupNumPresent) {
          const insertGroupNumData = parsed.data.find((row) => row.InsertGroup);
          if (insertGroupNumData) {
            setInsertGroupNum(insertGroupNumData.InsertGroup);
          }
        }

        e.target.value = null;
      },
      //
      error: (error) => {
        console.error("Error parsing CSV:", error);
        // Handle error state if needed
      },
    });
  };

  // handlers for SMS

  const handleSendTestSMS = async (toPhone, messageBody) => {
    try {
      const response = await fetch("http://localhost:5173/sendTestMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toPhone: toPhone,
          messageBody: messageBody,
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

  const handleSendSMS = async (rows, messageBody) => {
    try {
      const response = await fetch("http://localhost:5173/sendSMSMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rows: { rows },
          messageBody: { messageBody },
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

  const handleSendMessagesClick = async () => {
    // gives popup with message status
    setOpen(true);
    setMessageStatus("Sending messages...");
    // add progress bar here later

    try {
      const result = await handleSendSMS(rows, message);
      console.log(`Message result: ${result}`);
      setMessageStatus("Messages sent successfully");
    } catch (error) {
      setMessageStatus("Error sending messages");
      console.error("Error sending messages:", error);
    }
  };

  /* call it from a seperate function so we can pop up modal and adjust the message status */

  const handleTestMessageClick = async () => {
    try {
      setOpen(true);
      const result = await handleSendTestSMS(testPhoneNumber, message);
      setMessageStatus(`TEST MESSAGE - ${result}`);
    } catch (error) {
      setMessageStatus(`TEST MESSAGE - ${error}`);
    }
  };

  // Char Count Stuff

  const maxLength = 160;
  const handleCharChange = (event) => {
    setCharCount(event.target.value.length);
    setMessage(event.target.value);
  };

  const remainingChars = maxLength - charCount;

  const countColor =
    charCount > maxLength - 20
      ? "red"
      : charCount > maxLength - 50
        ? "orange"
        : "white";

  //get past insert group
  useEffect(() => {
    fetch("http://localhost:5173/lastGroupNum")
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
            disabled={!insertGroupNumEnabled}
            className={insertGroupNumEnabled ? "enabled" : "disabled"}
            value={insertGroupNum}
            onChange={changeInsertGroupNumber}
          ></input>
          <label htmlFor="groupNameInput">Enter a Group Name ::: </label>
          <input
            type="text"
            id="groupNameInput"
            disabled={!groupNameEnabled}
            className={groupNameEnabled ? "enabled" : "disabled"}
            placeholder="Group Name Goes Here..."
            value={groupName}
            onChange={changeGroupName}
          ></input>
          <label htmlFor="phaseInput">Enter a Phase Number ::: </label>
          <input
            type="text"
            id="phaseInput"
            placeholder="Phase Number Goes Here..."
            disabled={!phaseEnabled}
            className={phaseEnabled ? "enabled" : "disabled"}
            value={phase}
            onChange={changePhase}
          ></input>
          {/* </div>
        <div className="smallContainer"> */}
          <label htmlFor="testPhoneInput">
            Enter A Test Phone Number Here :::
          </label>
          <input
            type="text"
            id="testPhoneInput"
            placeholder="555-123-4567"
            value={testPhoneNumber}
            onChange={changeTestPhone}
          />
          <button className="testButton" onClick={handleTestMessageClick}>
            Send Test Message
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
          {/* </div>
        <div className="smallContainer"> */}
          <label htmlFor="messageInput">Enter your Message ::: </label>
          <textarea
            id="messageInput"
            maxLength="160"
            placeholder="Max 160 Characters (Including Spaces)"
            onChange={handleCharChange}
            value={message}
          ></textarea>

          <span id="count" style={{ color: countColor }}>
            {" "}
            Characters Remaining: {remainingChars}/160
          </span>

          <button
            className="sendMessagesButton"
            onClick={handleSendMessagesClick}
          >
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
                <th>Phase</th>
                <th>month</th>
                <th>sendDate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{insertGroupNum}</td>
                <td>{groupName}</td>
                <td>{phase}</td>
                <td>{getDateStrings().month}</td>
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
