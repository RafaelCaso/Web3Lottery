import { NextPage } from "next";
import { useState } from "react";
import { EtherInput } from "./scaffold-eth";

const PlaceBet: NextPage = () => {
  const [amount, setAmount] = useState<string>("")
  return (
    <div>
      <EtherInput 
        value={amount}
        onChange={(e) => setAmount(e.valueOf)}
      />
    </div>
  )
  
}