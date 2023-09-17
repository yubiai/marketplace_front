// Initialize ethers.js and wagmi dependencies
import { ethers } from "ethers";
import * as React from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import styles from "@/styles/Home.module.css";

// Define a React function component to mint an NFT
export function MintNFT() {
  // Prepare the contract write configuration by providing the contract's address, ABI, function name, and overrides
  const { config } = usePrepareContractWrite({
    address: "Your Contract Address",
    abi: [
      {
        name: "mint",
        type: "function",
        stateMutability: "payable",
        inputs: [],
        outputs: [],
      },
    ],
    functionName: "mint",
    overrides: {
      from: "Your Walllet Address",
      value: ethers.utils.parseEther("0.000000001"), //the integer value should match your nft minting requirements
    },
  });

  // Use the useContractWrite hook to write to the contract's mint function and obtain the transaction data and write function
  const { data, write } = useContractWrite(config);

  // Use the useWaitForTransaction hook to wait for the transaction to be mined and return loading and success states
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  // Render the component with a button that triggers the mint transaction when clicked, a loading message while the transaction is in progress, and a success message when the transaction is successful
  return (
    <div className={styles.mintcontainer}>
      <button
        disabled={!write || isLoading}
        onClick={() => write?.()}
        className={styles.button49}
      >
        {isLoading ? "Minting..." : "Mint"}
      </button>
      {isSuccess && (
        <div>
          Successfully minted your NFT!
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
    </div>
  );
}