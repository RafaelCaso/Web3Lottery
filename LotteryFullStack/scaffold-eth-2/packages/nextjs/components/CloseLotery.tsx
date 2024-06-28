import { NextPage } from "next"
import { useState } from "react";

export const CloseLottery: NextPage = () => {

  const handleSubmit = () => {
    fetch('http://localhost:3001/close-lottery', {
      method : 'POST',
      headers: {
        'Content-type' : 'application/json'
      }
    })
    .then((res) => {
      if(!res.ok) {
        throw new Error("unable to post request")
      }
    })
  }

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h1 className="card-title">Close Lottery?</h1>
        <button className="btn bg-secondary" onClick={handleSubmit}>OK</button>

      </div>

    </div>
  )
}