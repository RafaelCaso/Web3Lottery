import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import {privateKeyToAccount} from "viem/accounts"
import {sepolia} from "viem/chains"
import {abi, bytecode} from "../assets/Lottery.json";
import * as dotenv from "dotenv";
dotenv.config()


const providerAPIKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY || "";


const TOKEN_NAME = "JamToken";
const TOKEN_SYMBOL = "JAM";
const BET_PRICE = "1";
const BET_FEE = "0.2";
const TOKEN_RATIO = 1n;

async function main() {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerAPIKey}`)

  })
  const myAccount =  privateKeyToAccount(`0x${deployerPrivateKey}`)
  const deployer = createWalletClient({
    account: myAccount,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerAPIKey}`)
  });

  // @ts-ignore
  const deploymentHash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    // @ts-ignore
    args: [TOKEN_NAME, TOKEN_SYMBOL, TOKEN_RATIO, parseEther(BET_PRICE), parseEther(BET_FEE)]
  })

  console.log(`Transaction Hash: ${deploymentHash}`)
  console.log("waiting for confirmations...")

  const receipt = await publicClient.waitForTransactionReceipt({hash : deploymentHash})

  console.log(`Contract deployed to: ${receipt.contractAddress}`)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})