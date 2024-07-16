export function getDateStrings() {
    const currentDate = new Date()

    return {
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        timestamp: currentDate.toISOString().slice(0, 19).replace('T', ' '),
    }
}
/*
export function filterData(rows) {
    let i = 1
    let filteredRows = []

    if (rows && rows.length > 0) {
        rows.forEach((row) => {
            // Check if required fields are present and not null or undefined
            /* 

                REQUIRED FIELDS ARE : 

                * DATE OF BIRTH 
                * FIRST NAME
                * LAST NAME
                * CELL PHONE NUMBER (CAN'T TEXT WITHOUT IT)
                * PERSON_ID (Info for Nextgen)
        
                
            
            const validData =
                row['first'] !== undefined &&
                row['first'] !== null &&
                row['first'] !== '' &&
                row['last'] !== undefined &&
                row['last'] !== null &&
                row['last'] !== '' &&
                row['cell_phone'] !== undefined &&
                row['cell_phone'] !== null &&
                row['cell_phone'] !== '' &&
                row['DOB'] !== undefined &&
                row['DOB'] !== null &&
                row['DOB'] !== ''

            if (validData) {
                const {
                    InsertGroup,
                    GroupName,
                    Phase,
                    created_timestamp,
                    start_sendDate,
                    person_id,
                    first,
                    last,
                    cell_phone,
                    month,
                    sendDate,
                    DOB,
                    mem_nbr,
                    txt_msg,
                } = row // Destructuring assignment
                filteredRows.push({
                    InsertGroup,
                    GroupName,
                    Phase,
                    created_timestamp,
                    start_sendDate,
                    person_id,
                    first,
                    last,
                    cell_phone,
                    month,
                    sendDate,
                    DOB,
                    mem_nbr,
                    txt_msg,
                })
            } else {
                console.error(
                    `Data Mapping Error: Invalid data present in row #: ${i}`
                )
            }
            i++
        })
    } else {
        console.error('Data Mapping Error: No data present to map...')
    }

    return filteredRows
} */

/*const sendDataToServer = async (filteredRows) => {
    try {
        const response = await fetch('/writeData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filteredRows }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Data sent successfully:', data);
    } catch (error) {
        console.error('Error sending data:', error);
    }
};
*/

// Read data from CSV
/*
                for (let i = filteredRows.length - 1; i >= 0; i--) {
                    const row = filteredRows[i];

                    // checks to see if insertGroup came with the 'data' input. 
                    // If they didn't default to taking the user-input insert group num and insertgroupname
                    if (!row['InsertGroup']) {
                      row['InsertGroup'] = insertGroupNum;
                    }
                    
                    // Same
                    if (!row['GroupName']) {
                      row['GroupName'] = groupName;
                    }

                    row["month"] = getDateStrings().month;
                    row["start_sendDate"] = getDateStrings().timestamp;
                    row["sendDate"] = getDateStrings().timestamp;
                    row["created_timestamp"] = getDateStrings().timestamp;
                    row['txt_msg'] = messageBody;
                    
                    try {
                        const res = sendTwilioMessage(row['cell_phone'], messageBody);

                        if (res === 'success') {
                            row['f_sent'] = 1;
                            row['txt_msg'] = messageBody;
                        } else {
                            row["f_sent"] = 0;
                        }
                    } catch (error) {
                        console.error(`Error sending Twilio message: ${error}`);
                        
                    }
                }
                resolve(sendDataToServer(filteredRows));
                // After completing the asynchronous operations, resolve with a status
               

            } catch (error) {
                console.error(`${error} occurred in function sendMessages()`);
             
                reject(error); // Reject with an error if there's an issue
            }
        });
    } catch (error) {
        console.error(`${error} occurred in function sendMessages()`);
   
        throw error; // Throw an error if there's an issue outside the promise
    }
}*/
