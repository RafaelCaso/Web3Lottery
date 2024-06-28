import {useReadContract} from "wagmi";
import {abi} from "../../hardhat/artifacts/contracts/LotteryToken.sol/LotteryToken.json"
import { NextPage } from "next";
import { useState, useEffect } from "react";


export const CheckLotteryState: NextPage = () => {
  const [data, setData] = useState<string>();
  
  useEffect(() => {fetch("http://localhost:3001/check-status")
    .then((result)=> result.json())
    .then((httpData) => {
      if(httpData.result === true){
        setData("Lottery is open for bets")
      }
      if(httpData.result === false) {
        setData("Lottery is closed")
      }
    })
  }, [])


  return <div><h1>{data}</h1></div>

}