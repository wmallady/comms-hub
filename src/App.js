
import { useState } from "react";
import SMS from './views/SMS'
import Email from './views/Email'
import './App.css'

export default function Root() {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = (Event) =>{
      setIsChecked(Event.target.checked);

  }

  return (
    <>
      <div id="sidebar">
        <div>
          <div className="toggle-button-cover">
            <div className="button-cover">
              <div className="button r" id="modeButton">
                <input type="checkbox" className="checkbox" onChange={handleCheckboxChange}/>
                <div className="knobs"></div>
                <div className="layer"></div>
            </div>
          </div>
        </div>
          {isChecked ? <SMS /> : <Email />}
        </div>
    </div>  
    </>
  );
}