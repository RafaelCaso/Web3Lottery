import {Injectable } from '@nestjs/common';
import {createPublicClient, createWalletClient, http, Address, parseEther, formatEther} from "viem"
import {privateKeyToAccount} from "viem/accounts"
import { sepolia } from 'viem/chains';
import {abi} from "../assets/Lottery.json";
import * as lotteryToken from "../assets/LotteryToken.json"


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

  async openLottery(time: string) {
    const currentBlock = await this.publicClient.getBlock();
    const timeStamp = currentBlock?.timestamp ?? 0;
    const response = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "openBets",
      args: [timeStamp + BigInt(time)]
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

  async purchaseTokens(address: Address, amount: string) {
    const response = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "purchaseTokens",
      from: address,
      value: parseEther(amount)
    })

    return response
  }

  async tokenBalance(address: `0x${string}`) {
    const tokenAddress = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "paymentToken",
    })

    const response = await this.publicClient.readContract({
      address: tokenAddress,
      abi: lotteryToken.abi,
      functionName: "balanceOf",
      args: [address]
    })


    return formatEther(response)


  }
  



}
