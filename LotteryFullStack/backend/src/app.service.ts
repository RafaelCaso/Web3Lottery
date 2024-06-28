import {Injectable } from '@nestjs/common';
import {createPublicClient, createWalletClient, http, Address} from "viem"
import {privateKeyToAccount} from "viem/accounts"
import { sepolia } from 'viem/chains';
import {abi} from "../assets/Lottery.json";


@Injectable()
export class AppService {
  

  publicClient;
  walletClient;

  constructor() {
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    });

    this.walletClient = createWalletClient({
      account: privateKeyToAccount(`0x${process.env.DEPLOYER_PRIVATE_KEY}`),
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    })
  }

  getContractAddress(): Address {
    return process.env.CONTRACT_ADDRESS as Address;
  }
  
  
  async checkStatus(): Promise<boolean> {
    const status = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "betsOpen"
    });

    return status;
  }

  async openLottery(time: number) {
    const testTime: number = 30;
    const currentBlock = await this.publicClient.getBlock();
    const timeStamp = currentBlock?.timestamp ?? 0;
    const response = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "openBets",
      args: [timeStamp + BigInt(testTime)]
    })

    return response;
  }

  async closeLottery() {
    const response = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "closeLottery"
    })

    return response;
  }



}
