"use client";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { WalletInfo } from "~~/components/WalletInfo";
import { CheckLotteryState } from "~~/components/CheckLotteryState";
import { OpenLottery } from "~~/components/OpenLottery";
import { CloseLottery } from "~~/components/CloseLotery";
import { PurchaseTokens } from "~~/components/PurchaseTokens";
import { DisplayTokenBalance } from "~~/components/DisplayTokenBalance";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">

          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          <WalletInfo />

          <CheckLotteryState />

          <OpenLottery />
          <CloseLottery />

          {connectedAddress && <PurchaseTokens address={connectedAddress as `0x${string}`}/>}

          {connectedAddress && <DisplayTokenBalance address={connectedAddress as `0x${string}`}/>}


        </div>

      </div>
    </>
  );
};

export default Home;
