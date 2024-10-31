import tokenAbi from "./tokenAbi.json";
import usdtAbi from "./usdtAbi.json";
import { tokenAddress, usdtAddress } from "./environment";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { config } from "../utils/Web3ModalProvider";

export const CHAIN_ID = 56;

export const tokenReadFunction = async (functionName, args) => {
  const data = await readContract(config, {
    address: tokenAddress,
    abi: tokenAbi,
    functionName,
    chainId: CHAIN_ID,
    args,
  });
  return data;
};
export const usdtReadFunction = async (functionName, args) => {
  const data = await readContract(config, {
    address: usdtAddress,
    abi: usdtAbi,
    functionName,
    chainId: CHAIN_ID,
    args,
  });
  return data;
};

/// write functions
export const tokenWriteFunction = async (functionName, args) => {
  const hash = await writeContract(config, {
    address: tokenAddress,
    abi: tokenAbi,
    functionName,
    chainId: CHAIN_ID,
    args,
  });
  const receipt = await waitForTransactionReceipt(config, {
    chainId: CHAIN_ID,
    hash,
  });
  return receipt?.transactionHash;
};

export const usdtWriteFunction = async (functionName, args) => {
  const hash = await writeContract(config, {
    address: usdtAddress,
    abi: usdtAbi,
    functionName,
    chainId: CHAIN_ID,
    args,
  });
  const receipt = await waitForTransactionReceipt(config, {
    chainId: CHAIN_ID,
    hash,
  });
  return receipt?.transactionHash;
};
