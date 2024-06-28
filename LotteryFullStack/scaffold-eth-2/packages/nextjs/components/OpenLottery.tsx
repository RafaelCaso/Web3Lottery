import {useState} from "react";
import { NextPage } from "next";

export const OpenLottery: NextPage = () => {
  const [time, setTime] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = () => {
    fetch("http://localhost:3001/open-lottery", {
      method : 'POST',
      headers: {
        'Content-type' : 'application/json'
      },
      body: JSON.stringify(
        {time : time}
      )
    })
    .then((res) => {
      if(!res.ok) {
        throw new Error("cannot post request")
      }

      return res.json();
    })
    .then((data) => {
      setFeedback("Participants may now begin placing bets")
      setTime(0);
    })
  }

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
      <h1 className="card-title">Open Lottery for Betting</h1>
      {feedback && <p>{feedback}</p>}
      <div>
        <div>
          <label className="label">
            How long in seconds?
            <input 
            type="number" 
            value={time}
            onChange={(e) => setTime(e.target.valueAsNumber)}
            />
          </label>
        </div>
      </div>
      <button className="btn bg-secondary" onClick={handleSubmit}>Open Lottery</button>
      </div>
    </div>
  )
}