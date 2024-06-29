import { NextPage } from "next";
import { useState } from "react";
import { EtherInput } from "./scaffold-eth";
import { Address } from "viem";

export const PurchaseTokens = (params: {address: Address}) => {
  const [ethAmount, setEthAmount] = useState<string>("")
  const [feedback, setFeedback] = useState<string>("")

  const handleSubmit = () => {
    const request = fetch(`http://localhost:3001/purchase-tokens`,{
      method: 'POST',
      headers: {
        'Content-type' : 'application/json'
      },

      body : JSON.stringify({
        address: params.address,
        amount: ethAmount
      })
    })
    .then((res) => {
      if(!res.ok) {
        setFeedback("Oh no, something went wrong :(")
        throw new Error("unable to make request")
      }

      return res.json()

    })
    .then((data) => {
      setFeedback("You may now participate in the lottery!")
    })
  }

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className=" card-body">
      <h1 className="card-title">Purchase Jam Tokens</h1>
      {feedback && <p>{feedback}</p>}
      <EtherInput
        value={ethAmount}
        onChange={amount => setEthAmount(amount)}
      />
      <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  )
}