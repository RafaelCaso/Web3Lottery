import { useEffect, useState } from "react";
import { Address } from "viem";


export const DisplayTokenBalance = (params: {address: Address}) => {
  const [balance, setBalance] = useState<number>()
  const [feedback, setFeedback] = useState<string>()

  useEffect(() => {
    fetch(`http://localhost:3001/token-balance?address=${params.address}`)
    .then((res) => {
      if(!res.ok) {
        setBalance(0)
        setFeedback("err")
        throw new Error("unable to complete request")
      }
      return res.json()
    })
    .then((data) => {
      setBalance(data.result)
    })

  }, [])

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
      <p className="card-title">Jam Tokens: {balance}</p>
      {feedback && <p>{feedback}</p>}
      </div>
    </div>
  )

}