import { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "./scaffold-eth";
import { WalletAction } from "./WalletAction";



export const WalletInfo: NextPage = () => {

  const {address, isConnecting, isDisconnected, chain} = useAccount();
  if(address)
    return (
      <>
        <div className="flex items-center flex-col flex-grow pt-10">
          <div className="px-5">
            <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Your account address is</p>
            <Address address={address} />
            <p className="my-2 font-medium">Connected to the network {chain?.name}</p>
            </div>
          </div>
        </div>
      </>
    )

    if(isConnecting)
      return (
        <div>
          <p>Loading...</p>
        </div>
      )

    if(isDisconnected)
      return(
        <div>
          <p>Connect wallet to continue.</p>
        </div>
      )
  
}