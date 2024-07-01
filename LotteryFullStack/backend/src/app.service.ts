import {Injectable } from '@nestjs/common';
import {createPublicClient, createWalletClient, http, Address, parseEther, formatEther} from "viem"
import {privateKeyToAccount} from "viem/accounts"
import { sepolia } from 'viem/chains';
import {abi} from "../assets/Lottery.json";
import * as lotteryToken from "../assets/LotteryToken.json"

const MAXUINT256 =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n;

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

  async approve(address: `0x${string}`) {
    const contractAddress = this.getContractAddress();

    const tokenAddress = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "paymentToken"
    })

    console.log("TokenAddress: ", tokenAddress)

    const allowTx = await this.walletClient.writeContract({
      address: tokenAddress,
      abi: lotteryToken.abi,
      functionName: "approve",
      args: [contractAddress, MAXUINT256],
      from: address
    })

    console.log("allowTX response: ", allowTx)

    const allowTxReceipt = await this.publicClient.waitForTransactionReceipt({hash: allowTx })

    console.log("allowTxReceipt: ", allowTxReceipt)

    return allowTxReceipt;
  }

  async bet(amount: number, address: `0x${string}`) {
    // const testAmount = 1
    const contractAddress = this.getContractAddress();

    const tokenAddress = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "paymentToken"
    })

    // console.log("TokenAddress: ", tokenAddress)

    // const allowTx = await this.walletClient.writeContract({
    //   address: tokenAddress,
    //   abi: lotteryToken.abi,
    //   functionName: "approve",
    //   args: [contractAddress, MAXUINT256],
    //   from: address
    // })

    // console.log("allowTX response: ", allowTx)

    // const allowTxReceipt = await this.publicClient.waitForTransactionReceipt({hash: allowTx })

    // console.log("allowTxReceipt: ", allowTxReceipt)
    


    // const tx = await this.walletClient.writeContract({
    //   address: this.getContractAddress(),
    //   abi: abi,
    //   functionName: "bet",
    //   // args: [BigInt(testAmount)],
    //   from: address
    // })

    // console.log("Tx: ", tx);

    // const receipt = await this.publicClient.waitForTransactionReceipt({hash: tx})

    // console.log("Tx Receipt: ", receipt)
    // return receipt;

    const allowTx = await this.walletClient.writeContract({
      address: tokenAddress,
      abi: lotteryToken.abi,
      functionName: "approve",
      args: [contractAddress, MAXUINT256],
      from: address
    });

    console.log("allowTX response: ", allowTx);

    // Wait for the approval transaction to be mined
    const allowTxReceipt = await this.publicClient.waitForTransactionReceipt({ hash: allowTx });

    console.log("allowTxReceipt: ", allowTxReceipt);

    if (!allowTxReceipt || allowTxReceipt.status === false) {
      throw new Error('Approval transaction failed');
    }

    // Place the bet
    const betTx = await this.walletClient.writeContract({
      address: contractAddress,
      abi: abi,
      functionName: "bet",
      from: address
    });

    console.log("Bet TX: ", betTx);

    // Wait for the bet transaction to be mined
    const betTxReceipt = await this.publicClient.waitForTransactionReceipt({ hash: betTx });

    console.log("Bet Tx Receipt: ", betTxReceipt);

    if (!betTxReceipt || betTxReceipt.status === false) {
      throw new Error('Bet transaction failed');
    }


  }

  async readWinner() {
    const tx = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: abi,
      functionName: "prize",
      args: ["0xd1B41bE30F980315b8A6b754754aAa299C7abea2"]
    })

    console.log(formatEther(tx))


  }
  



}
